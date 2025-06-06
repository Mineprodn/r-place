
const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const scale = 10;
const colorPicker = document.getElementById('colorPicker');
let color = colorPicker.value;

colorPicker.addEventListener('input', () => {
  color = colorPicker.value;
});

// Load saved pixels from server
fetch('/api/board')
  .then(res => res.json())
  .then(data => {
    for (const key in data) {
      const [x, y] = key.split(',').map(Number);
      ctx.fillStyle = data[key];
      ctx.fillRect(x * scale, y * scale, scale, scale);
    }
  });

canvas.addEventListener('click', (e) => {
  const x = Math.floor(e.offsetX / scale);
  const y = Math.floor(e.offsetY / scale);

  ctx.fillStyle = color;
  ctx.fillRect(x * scale, y * scale, scale, scale);

  // Send pixel to server
  fetch('/api/pixel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ x, y, color })
  });
});
