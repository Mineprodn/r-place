// ... dein bestehender Code oben

let connectedUsers = 0;

io.on('connection', (socket) => {
  connectedUsers++;
  io.emit('user_count', connectedUsers);
  console.log(`Client verbunden - Nutzer: ${connectedUsers}`);

  socket.emit('load_pixels', pixels);

  socket.on('place_pixel', ({ x, y, color }) => {
    const key = `${x},${y}`;
    pixels[key] = color;
    io.emit('update_pixel', { x, y, color });
  });

  socket.on('disconnect', () => {
    connectedUsers--;
    io.emit('user_count', connectedUsers);
    console.log(`Client getrennt - Nutzer: ${connectedUsers}`);
  });
});
