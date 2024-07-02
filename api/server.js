const express = require('express')

const server = express()

server.get('/api/users', (seq, res) => {
    res.json('Users here')
})

server.use('*', (req, res) => {
    res.status(404).json({
        message: 'Not found'
    })
})

module.exports = server;
