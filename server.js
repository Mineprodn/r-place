const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const PORT = process.env.PORT || 3000;

let pixels = {};
const FILE = 'pixels.json';

if (fs.existsSync(FILE)) {
  pixels = JSON.parse(fs.readFileSync(FILE));
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/board', (req, res) => {
  res.json(pixels);
});

io.on('connection', (socket) => {
  console.log('🔌 Ein Benutzer ist verbunden');

  socket.emit('init', pixels);

  socket.on('place_pixel', ({ x, y, color }) => {
    const key = `${x},${y}`;
    pixels[key] = color;
    fs.writeFileSync(FILE, JSON.stringify(pixels));
    io.emit('update_pixel', { x, y, color });
  });

  socket.on('disconnect', () => {
    console.log('🚪 Verbindung getrennt');
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server läuft auf Port ${PORT}`);
});
