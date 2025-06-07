const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs');
const path = require('path');

const saveFile = path.join(__dirname, 'canvas_data.json');

let pixels = {};
let gridWidth = 100;
let gridHeight = 100;

// Load existing data
if (fs.existsSync(saveFile)) {
  const data = JSON.parse(fs.readFileSync(saveFile));
  pixels = data.pixels || {};
  gridWidth = data.gridWidth || 100;
  gridHeight = data.gridHeight || 100;
}

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('User connected');

  socket.emit('init', { pixels, gridWidth, gridHeight });

  socket.on('place_pixel', ({ x, y, color }) => {
    const key = `${x},${y}`;
    pixels[key] = color;
    saveCanvas();
    io.emit('update_pixel', { x, y, color });
  });

  socket.on('resize_canvas', ({ width, height }) => {
    gridWidth = width;
    gridHeight = height;
    saveCanvas();
    io.emit('canvas_resized', { width, height });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

function saveCanvas() {
  fs.writeFileSync(saveFile, JSON.stringify({ pixels, gridWidth, gridHeight }));
}

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log('Server listening on port', PORT);
});