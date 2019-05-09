const express = require('express');
const app = express();
const server = require('http').createServer(app);
const path = require('path');
const io = require('socket.io').listen(server);
const port = process.env.PORT || 3000;

let users = [];
let connections = []
let games = {};

let currentGameCode = 111111;

server.listen(port);
console.log('Server Running...')

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', (socket) => {
    connections.push(socket);
    console.log(`Connected: ${connections.length} sockets connected`);

    socket.on('disconnect', () => {
        connections.splice(connections.indexOf(socket), 1);
        console.log(`Disconnected: ${connections.length} sockets connected`);
    });

    socket.on('new game', () => {
        games[currentGameCode] = {
            'connections': [socket],
            'users': []
        }

        socket.emit('game code', currentGameCode);
        currentGameCode++;
    });

    socket.on('join game', (code) => {
        if (games.hasOwnProperty(code)) {
            games[code].connections.push(socket);
            socket.emit('game found');
            socket.emit('game code', code);
        } else {
            socket.emit('game not found');
        }
    });
});