const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const {generateMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    console.log('New user connected');

    socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app'));

    socket.broadcast.emit('newMessage',generateMessage('Admin','New user joined'));


    socket.on('createMessage',(message,callback)=>{
        console.log('create message',message);
        io.emit('newMessage',generateMessage(message.from,message.text));
        callback('this is from server');

    });

    socket.on('disconnect',()=>{
       console.log('User was disconnected');
    });

});

server.listen(3000,()=>{
    console.log('Server is up on port 3000');
});