const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botname = 'Chatcord Bot';

// Run when client connects
io.on('connection', socket => {
    // console.log('New WS Connection.... ');
    socket.on('joinroom', ({username, room}) => {
        // Welcome to current user
        socket.emit('message', formatMessage(botname, 'Welcome to chatcord'))

        // Broadcast when user connects
        socket.broadcast.emit('message', formatMessage(botname,"A user has joined the chat")); 
    });

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        io.emit('message', formatMessage('USER',msg));
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botname,'A user has left the chat'));
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));