const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const scale = 10;
let color = colorPicker.value;

canvas.width = 100 * scale;
canvas.height = 100 * scale;

// WICHTIG: Verbindung mit aktuellem Server herstellen (auch online)
const socket = io(window.location.origin);

// Farbe wählen
colorPicker.addEventListener('input', () => {
  color = colorPicker.value;
});

// Beim Klick Pixel setzen und senden
canvas.addEventListener('click', (e) => {
  const x = Math.floor(e.offsetX / scale);
  const y = Math.floor(e.offsetY / scale);
  socket.emit('place_pixel', { x, y, color });
});

// Empfang von Änderungen
socket.on('update_pixel', ({ x, y, color }) => {
  ctx.fillStyle = color;
  ctx.fillRect(x * scale, y * scale, scale, scale);
});

// Anfangsdaten laden
socket.on('init', (pixels) => {
  for (const key in pixels) {
    const [x, y] = key.split(',').map(Number);
    ctx.fillStyle = pixels[key];
    ctx.fillRect(x * scale, y * scale, scale, scale);
  }
});
