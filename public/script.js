let allPixels = {}; // global speichern

socket.on('init', ({ pixels, gridWidth: w, gridHeight: h }) => {
  gridWidth = w;
  gridHeight = h;
  allPixels = pixels;
  widthInput.value = w;
  heightInput.value = h;
  resizeCanvas();
  drawAllPixels();
});

socket.on('canvas_resized', ({ width, height }) => {
  gridWidth = width;
  gridHeight = height;
  widthInput.value = width;
  heightInput.value = height;
  resizeCanvas();
  drawAllPixels();
});

socket.on('update_pixel', ({ x, y, color }) => {
  const key = `${x},${y}`;
  allPixels[key] = color;
  drawPixel(x, y, color);
});

function resizeCanvas() {
  canvas.width = gridWidth * pixelSize;
  canvas.height = gridHeight * pixelSize;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawAllPixels() {
  for (const key in allPixels) {
    const [x, y] = key.split(',').map(Number);
    if (x < gridWidth && y < gridHeight) {
      drawPixel(x, y, allPixels[key]);
    }
  }
}
