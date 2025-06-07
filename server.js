let pixels = {};
let gridWidth = 100;   // Standardgröße
let gridHeight = 100;

io.on('connection', (socket) => {
  // Neue Verbindung
  socket.emit('init_canvas', { width: gridWidth, height: gridHeight, pixels });

  // Pixel setzen
  socket.on('place_pixel', ({ x, y, color }) => {
    const key = `${x},${y}`;
    pixels[key] = color;
    io.emit('update_pixel', { x, y, color });
  });

  // Neue Größe von einem Client
  socket.on('resize_canvas', ({ width, height }) => {
    gridWidth = width;
    gridHeight = height;
    io.emit('canvas_resized', { width, height });
  });

  // Nutzerzähler
  connectedUsers++;
  io.emit('user_count', connectedUsers);

  socket.on('disconnect', () => {
    connectedUsers--;
    io.emit('user_count', connectedUsers);
  });
});
