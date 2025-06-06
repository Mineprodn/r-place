const socket = io();

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');

let scale = 10;
let gridWidth = canvas.width / scale;   // Anzahl Pixel horizontal
let gridHeight = canvas.height / scale; // Anzahl Pixel vertikal

let color = colorPicker.value;
let pixelData = {}; // Speicher für alle Pixel: key = "x,y", value = color

colorPicker.addEventListener('input', () => {
  color = colorPicker.value;
});

function drawPixel(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * scale, y * scale, scale, scale);
  pixelData[`${x},${y}`] = color;
}

// Canvas neu zeichnen aus pixelData (z.B. nach Resize)
function redrawPixels() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const key in pixelData) {
    const [x, y] = key.split(',').map(Number);
    if (x < gridWidth && y < gridHeight) {
      drawPixel(x, y, pixelData[key]);
    }
  }
}

// Pixel setzen und an Server senden
function placePixel(x, y) {
  if (x >= gridWidth || y >= gridHeight) return; // außerhalb des Canvas
  socket.emit('place_pixel', { x, y, color });
}

canvas.addEventListener('click', (e) => {
  const x = Math.floor(e.offsetX / scale);
  const y = Math.floor(e.offsetY / scale);
  placePixel(x, y);
});

// Socket Events
socket.on('update_pixel', ({ x, y, color }) => {
  if (x >= gridWidth || y >= gridHeight) return; // außerhalb neuer Größe ignorieren
  drawPixel(x, y, color);
});

socket.on('load_pixels', (pixels) => {
  pixelData = pixels;
  redrawPixels();
});

// *** Neues Feature: Menü für Canvas-Größe ***

function openResizeMenu() {
  const newSize = prompt(
    `Aktuelle Größe: ${gridWidth} x ${gridHeight} Pixel\n` +
    `Gib die neue Breite (in Pixeln) ein:`,
    gridWidth
  );
  
  if (!newSize) return; // Abbruch
  
  const newWidth = parseInt(newSize);
  if (isNaN(newWidth) || newWidth <= 0) {
    alert("Ungültige Eingabe!");
    return;
  }
  
  // Canvas breiter machen, Höhe bleibt gleich (optional anpassbar)
  gridWidth = newWidth;
  canvas.width = gridWidth * scale;
  
  // Neu zeichnen ohne Pixelverlust
  redrawPixels();
}

// Event-Listener für Taste "b"
window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'b') {
    openResizeMenu();
  }
});
