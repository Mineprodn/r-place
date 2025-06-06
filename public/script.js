const socket = io();

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');

let scale = 10;
let gridWidth = canvas.width / scale;
let gridHeight = canvas.height / scale;

let color = colorPicker.value;
let pixelData = {};

colorPicker.addEventListener('input', () => {
  color = colorPicker.value;
});

function drawPixel(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * scale, y * scale, scale, scale);
  pixelData[`${x},${y}`] = color;
}

function redrawPixels() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const key in pixelData) {
    const [x, y] = key.split(',').map(Number);
    if (x < gridWidth && y < gridHeight) {
      drawPixel(x, y, pixelData[key]);
    }
  }
}

function placePixel(x, y) {
  if (x < 0 || y < 0 || x >= gridWidth || y >= gridHeight) return;
  socket.emit('place_pixel', { x, y, color });
}

let drawing = false;

canvas.addEventListener('mousedown', e => {
  drawing = true;
  const x = Math.floor(e.offsetX / scale);
  const y = Math.floor(e.offsetY / scale);
  placePixel(x, y);
});

canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mouseleave', () => drawing = false);

canvas.addEventListener('mousemove', e => {
  if (!drawing) return;
  const x = Math.floor(e.offsetX / scale);
  const y = Math.floor(e.offsetY / scale);
  placePixel(x, y);
});

socket.on('update_pixel', ({ x, y, color }) => {
  if (x < 0 || y < 0 || x >= gridWidth || y >= gridHeight) return;
  drawPixel(x, y, color);
});

socket.on('load_pixels', pixels => {
  pixelData = pixels;
  redrawPixels();
});

// Menü für Canvas-Größe

const resizeMenu = document.getElementById('resizeMenu');
const overlay = document.getElementById('overlay');
const inputWidth = document.getElementById('inputWidth');
const inputHeight = document.getElementById('inputHeight');
const btnApply = document.getElementById('btnApply');
const btnCancel = document.getElementById('btnCancel');

function openResizeMenu() {
  inputWidth.value = gridWidth;
  inputHeight.value = gridHeight;
  resizeMenu.style.display = 'block';
  overlay.style.display = 'block';
}

function closeResizeMenu() {
  resizeMenu.style.display = 'none';
  overlay.style.display = 'none';
}

btnCancel.addEventListener('click', () => {
  closeResizeMenu();
});

btnApply.addEventListener('click', () => {
  const newWidth = parseInt(inputWidth.value);
  const newHeight = parseInt(inputHeight.value);

  if (
    isNaN(newWidth) || newWidth <= 0 ||
    isNaN(newHeight) || newHeight <= 0
  ) {
    alert('Bitte gültige positive Zahlen eingeben!');
    return;
  }

  gridWidth = newWidth;
  gridHeight = newHeight;

  canvas.width = gridWidth * scale;
  canvas.height = gridHeight * scale;

  redrawPixels();
  closeResizeMenu();
});

// Menü mit Taste "b" öffnen
window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'b') {
    openResizeMenu();
  }
});
