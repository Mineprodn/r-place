// server.js (Node.js mit Express und Socket.IO)

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const pixels = {}; // { "x,y": color }

io.on('connection', (socket) => {
  console.log('Client connected');

  // Alle Pixel senden, wenn ein neuer Client kommt
  socket.emit('load_pixels', pixels);

  // Wenn ein Pixel gesetzt wird
  socket.on('place_pixel', ({ x, y, color }) => {
    const key = `${x},${y}`;
    pixels[key] = color;

    // An alle Clients senden (inklusive Sender)
    io.emit('update_pixel', { x, y, color });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
