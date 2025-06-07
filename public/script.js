const socket = io(); // Socket.IO client-Verbindung

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const pixelSize = 10;

let gridWidth = 100;
let gridHeight = 100;
let pixels = {};

function drawPixel(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
}

socket.on('init', (data) => {
  pixels = data.pixels || {};
  gridWidth = data.gridWidth || 100;
  gridHeight = data.gridHeight || 100;

  canvas.width = gridWidth * pixelSize;
  canvas.height = gridHeight * pixelSize;

  for (const key in pixels) {
    const [x, y] = key.split(',').map(Number);
    drawPixel(x, y, pixels[key]);
  }
});

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / pixelSize);
  const y = Math.floor((e.clientY - rect.top) / pixelSize);

  const color = '#000000'; // z.B. feste Farbe oder von Colorpicker

  socket.emit('place_pixel', { x, y, color });
});

socket.on('update_pixel', ({ x, y, color }) => {
  pixels[`${x},${y}`] = color;
  drawPixel(x, y, color);
});
