const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    options: {
        cors: '*'
    }
});

const port = process.env.PORT || 3000;

io.on('connection', (socket) => {
    console.log('AQUI')
   socket.on('join', (payload) => {
       const { idPeer, roomName } = payload;
       socket.join(roomName);
       socket.to(roomName).broadcast.emit('new-user', payload);
       console.log('Usuario conectado', payload);

       socket.on('disconnect', () => {
           socket.to(roomName).broadcast.emit('bye-user', payload);
       })
   })
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});