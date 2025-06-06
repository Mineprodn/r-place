const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.use(express.static('public'));

const pixels = {}; // Format: {"x,y": color}

// Beim neuen Client alle Pixel senden
io.on('connection', (socket) => {
  console.log('Client verbunden');
  socket.emit('load_pixels', pixels);

  socket.on('place_pixel', ({ x, y, color }) => {
    const key = `${x},${y}`;
    pixels[key] = color;
    io.emit('update_pixel', { x, y, color });
  });

  socket.on('disconnect', () => {
    console.log('Client getrennt');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
