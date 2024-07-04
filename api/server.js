const express = require('express')
const Users = require('./users/model')
const server = express()
server.use(express.json())

server.get('/api/users', (req, res) => {
    console.log(req.params)
    Users.find()
        .then(users => {
            res.json(users)
        })
        .catch(err => {
            res.status(500).json({
                message: 'Error getting users',
                err: err.message,
                stack: err.stack
            })
        })
})

server.get('/api/users/:id', (req, res) => {
    Users.findById(req.params.id)
    .then(user => {
        if(!user){
            res.status(404).json({
                message: 'The user with the specified ID does not exist',
            })
        }
        res.json(user)
    })
    .catch(err => {
        res.status(500).json({
            message: 'The user information could not be retrieved',
            err: err.message,
            stack: err.stack
        })
    })
})

server.post('/api/users', (req, res) => {
    const bodyOfUser = req.body
    if(!bodyOfUser.name || !bodyOfUser.bio){
        res.status(400).json({
            message: 'Please provide name and bio for the user',
        })
    }else{
        Users.insert(bodyOfUser)
            .then(user => {
                res.status(201).json(user)
            })
            .catch(err => {
                res.status(500).json({
                    message: 'Error getting post',
                    err: err.message,
                    stack: err.stack
                })
            })
    }
})

server.delete('/api/users/:id', async (req, res) => {
    const possibleDeleteUser = await Users.findById(req.params.id)
    if(!possibleDeleteUser){
        res.status(404).json({
            message: "The user with the specified ID does not exist"
        })
    }else{
        const removeUser = await Users.remove(possibleDeleteUser.id)
        res.status(200).json(removeUser)
    }
})

server.put('/api/users/:id', async (req, res) => {
    try{
        const potentialUser = await Users.findById(req.params.id)
        if(!potentialUser){
            res.status(404).json({
                message: "The user with the specified ID does not exist"
            })
        }else{
            if(!req.body.name || !req.body.bio){
                res.status(400).json({
                    message: "Please provide name and bio for the user"
                })
            }else{
                const updateUser = await Users.update(req.params.id, req.body)
                res.status(200).json(updateUser)
            }

        }
    }catch(error){
        res.status(500).json({
            message: "The user information could not be modified",
            error: error.message,
            stack: error.stack
        })
    }
})

server.use('*', (req, res) => {
    res.status(404).json({
        message: 'Not found'
    })
})

module.exports = server;
