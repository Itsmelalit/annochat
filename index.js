const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const path = require('path');

// app.use(express.static(__dirname + '/public'));
// app.use('/static', express.static(path.join(__dirname, '/public')))
app.use(express.static('public'));
app.get('/',(req,res)=>{
    res.sendFile(__dirname +'/public/home.html')
});
app.get('/otv',(req,res)=>{
    res.sendFile(__dirname +'/public/ome.html')
});
app.get('/grp',(req,res)=>{
    res.sendFile(__dirname+'/public/group.html')
});
const waitingUsers = [];
let roomCounter = 1;
// const users = [];

io.on('connection', (socket) => {
    console.log("a user connected", socket.id);
    socket.on('sendusername',(data) =>{
        console.log(`${data} joined`)
        socket.broadcast.emit('brdcast',data);
    });
    // if (waitingUsers.length > 0 ) {
    //     const partnerSocketId = waitingUsers.pop();
    //     const roomName = `room-${roomCounter}`;

    //     socket.join(roomName);
    //     // partnerSocketId.join(roomName);
    //     const partnerSocket = io.sockets.sockets.get(partnerSocketId);
    //     partnerSocket.join(roomName);
    //     socket.room = roomName;
    //     partnerSocket.room = roomName;
    //     console.log('user joined in a room',socket.id,partnerSocket.id);
    //     console.log(waitingUsers);
    //     io.to(socket.room).emit('partnerjoined', roomName);

        // roomCounter++;}
    //     else {
    //     waitingUsers.push(socket.id);
    //     console.log('user joined in waiting list',socket.id);
    //     console.log(waitingUsers);
    // };
socket.on('addlist',(data)=>{
    // waitingUsers.push(data);
    // console.log(waitingUsers);
    if (waitingUsers.length > 0 ) {
        const partnerSocketId = waitingUsers.pop();
        const roomName = `room-${roomCounter}`;

        socket.join(roomName);
        // partnerSocketId.join(roomName);
        const partnerSocket = io.sockets.sockets.get(partnerSocketId);
        partnerSocket.join(roomName);
        socket.room = roomName;
        partnerSocket.room = roomName;
        console.log('user joined in a room',socket.id,partnerSocket.id);
        console.log(waitingUsers);
        io.to(socket.room).emit('partnerjoined', roomName);

        roomCounter++;}else{
        waitingUsers.push(socket.id);
        console.log('user joined in waiting list',socket.id);
        console.log(waitingUsers);
        }
});
    socket.on('endchat',()=>{
     socket.disconnect();
});
    socket.on('sendMessage', ( msg ) => {
        console.log(`rcvd msg is ${msg}`);
        // const roomName = Object.keys(socket.rooms).find(room => room !== socket.id);
        socket.to(socket.room).emit('recieveMessage', {msg});
    });
    socket.on('disconnect', () => {
        console.log(socket.id, 'disconnected');
        // users.pop(x);
        io.to(socket.room).emit('userleft');
        socket.leave(socket.room);
        // const partnerSocket = io.sockets.sockets.get(partnerSocketId);
        // partnerSocket.leave(socket.room);
        // partnerSocket.push(waitingUsers);
        console.log(waitingUsers);
        const index = waitingUsers.indexOf(socket.id);
        if (index !== -1) {
            waitingUsers.splice(index, 1);
        }
    });
    socket.on('moklo',({x,msg})=>{
        console.log('mila hua msg',msg,x);
        socket.broadcast.emit('malyo',{x,msg});
    })
});

const PORT = process.env.PORT || 200;
server.listen(PORT, () => {
    console.log("server listening on 3000");
});
