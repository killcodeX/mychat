const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave,getRoomUsers } = require('./utils/users');

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

        const user = userJoin(socket.id, username, room);
        socket.join(user.room)

        // Welcome to current user
        socket.emit('message', formatMessage(botname, 'Welcome to chatcord'))

        // Broadcast when user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(botname,`${user.username} has joined the chat`)); 
    });

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        io.emit('message', formatMessage('USER',msg));
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message', formatMessage(botname,`${user.username} has left the chat`));
        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));