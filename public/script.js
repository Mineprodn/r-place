const socket = io();

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const scale = 10;
let drawing = false;
let color = colorPicker.value;

colorPicker.addEventListener('input', () => {
  color = colorPicker.value;
});

// Pixel setzen beim Ziehen
function placePixel(x, y) {
  const gridX = Math.floor(x / scale);
  const gridY = Math.floor(y / scale);
  socket.emit('place_pixel', { x: gridX, y: gridY, color });
}

// Maus gedrückt → starten
canvas.addEventListener('mousedown', (e) => {
  drawing = true;
  placePixel(e.offsetX, e.offsetY);
});

// Maus losgelassen → stoppen
canvas.addEventListener('mouseup', () => {
  drawing = false;
});

// Maus verlässt das Canvas → auch stoppen
canvas.addEventListener('mouseleave', () => {
  drawing = false;
});

// Während Ziehen → weiter Pixel setzen
canvas.addEventListener('mousemove', (e) => {
  if (drawing) {
    placePixel(e.offsetX, e.offsetY);
  }
});

// Pixel empfangen und anzeigen
socket.on('update_pixel', ({ x, y, color }) => {
  ctx.fillStyle = color;
  ctx.fillRect(x * scale, y * scale, scale, scale);
});

// Beim Laden: alle Pixel erhalten
socket.on('load_pixels', (pixels) => {
  for (const key in pixels) {
    const [x, y] = key.split(',');
    ctx.fillStyle = pixels[key];
    ctx.fillRect(x * scale, y * scale, scale, scale);
  }
});
