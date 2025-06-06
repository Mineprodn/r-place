const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const scale = 10;
let color = colorPicker.value;

canvas.width = 100 * scale;
canvas.height = 100 * scale;

// Lade gespeichertes Board aus localStorage
const saved = JSON.parse(localStorage.getItem("boardData") || "{}");
for (const key in saved) {
  const [x, y] = key.split(',').map(Number);
  ctx.fillStyle = saved[key];
  ctx.fillRect(x * scale, y * scale, scale, scale);
}

colorPicker.addEventListener('input', () => {
  color = colorPicker.value;
});

canvas.addEventListener('click', (e) => {
  const x = Math.floor(e.offsetX / scale);
  const y = Math.floor(e.offsetY / scale);
  ctx.fillStyle = color;
  ctx.fillRect(x * scale, y * scale, scale, scale);

  // Speichern im localStorage
  saved[`${x},${y}`] = color;
  localStorage.setItem("boardData", JSON.stringify(saved));
});
