const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = 3000;

app.use(express.static('public'));

let pixels = {};
const FILE = 'pixels.json';

// Load existing pixels
if (fs.existsSync(FILE)) {
  pixels = JSON.parse(fs.readFileSync(FILE));
}

// Serve pixel data
app.get('/api/board', (req, res) => {
  res.json(pixels);
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('Ein Benutzer ist verbunden');

  // Send initial pixel data
  socket.emit('init', pixels);

  socket.on('place_pixel', ({ x, y, color }) => {
    const key = `${x},${y}`;
    pixels[key] = color;
    fs.writeFileSync(FILE, JSON.stringify(pixels));
    io.emit('update_pixel', { x, y, color });
  });

  socket.on('disconnect', () => {
    console.log('Ein Benutzer hat die Verbindung getrennt');
  });
});

server.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
