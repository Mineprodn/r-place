
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

let pixels = {};
let gridWidth = 100;
let gridHeight = 100;
let connectedUsers = 0;

io.on('connection', (socket) => {
  connectedUsers++;
  io.emit('user_count', connectedUsers);

  socket.emit('init_canvas', { width: gridWidth, height: gridHeight, pixels });

  socket.on('place_pixel', ({ x, y, color }) => {
    const key = `${x},${y}`;
    pixels[key] = color;
    io.emit('update_pixel', { x, y, color });
  });

  socket.on('resize_canvas', ({ width, height }) => {
    gridWidth = width;
    gridHeight = height;
    io.emit('canvas_resized', { width, height });
  });

  socket.on('disconnect', () => {
    connectedUsers--;
    io.emit('user_count', connectedUsers);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
