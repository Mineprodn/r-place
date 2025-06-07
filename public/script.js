const socket = io();
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const menu = document.getElementById('menu');
const widthInput = document.getElementById('widthInput');
const heightInput = document.getElementById('heightInput');
const resizeBtn = document.getElementById('resizeBtn');
const userCountEl = document.getElementById('userCount');

let gridWidth = 100;
let gridHeight = 100;
let pixelSize = 8;
let mouseDown = false;

canvas.addEventListener('mousedown', () => mouseDown = true);
canvas.addEventListener('mouseup', () => mouseDown = false);
canvas.addEventListener('mouseleave', () => mouseDown = false);

canvas.addEventListener('mousemove', (e) => {
  if (!mouseDown) return;
  placePixel(e);
});

canvas.addEventListener('click', placePixel);

function placePixel(e) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / pixelSize);
  const y = Math.floor((e.clientY - rect.top) / pixelSize);
  const color = colorPicker.value;
  socket.emit('place_pixel', { x, y, color });
}

resizeBtn.addEventListener('click', () => {
  const width = parseInt(widthInput.value);
  const height = parseInt(heightInput.value);
  if (width > 0 && height > 0) {
    socket.emit('resize_canvas', { width, height });
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'b') {
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
  }
});

socket.on('init', ({ pixels, gridWidth: w, gridHeight: h }) => {
  gridWidth = w;
  gridHeight = h;
  resizeCanvas();
  for (const key in pixels) {
    const [x, y] = key.split(',').map(Number);
    drawPixel(x, y, pixels[key]);
  }
});

socket.on('update_pixel', ({ x, y, color }) => {
  drawPixel(x, y, color);
});

socket.on('canvas_resized', ({ width, height }) => {
  gridWidth = width;
  gridHeight = height;
  widthInput.value = width;
  heightInput.value = height;
  resizeCanvas();
});

socket.on('user_count', (count) => {
  userCountEl.textContent = count;
});

function resizeCanvas() {
  canvas.width = gridWidth * pixelSize;
  canvas.height = gridHeight * pixelSize;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawPixel(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
}