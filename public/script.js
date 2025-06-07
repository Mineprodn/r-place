const socket = io();

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const pixelSize = 10;
let gridWidth = 100;
let gridHeight = 100;
let pixels = {};
let isDrawing = false;

// Menüelemente
const menu = document.getElementById("resizeMenu");
const widthInput = document.getElementById("widthInput");
const heightInput = document.getElementById("heightInput");
const applyButton = document.getElementById("applyResize");

// Menü ein-/ausblenden mit Taste B
document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "b") {
    menu.style.display = menu.style.display === "none" ? "block" : "none";
  }
});

applyButton.addEventListener("click", () => {
  const newWidth = parseInt(widthInput.value);
  const newHeight = parseInt(heightInput.value);
  if (newWidth > 0 && newHeight > 0) {
    socket.emit("resize_canvas", { width: newWidth, height: newHeight });
    menu.style.display = "none";
  }
});

// Maus-Events für Ziehen
canvas.addEventListener("mousedown", () => {
  isDrawing = true;
});

canvas.addEventListener("mouseup", () => {
  isDrawing = false;
});

canvas.addEventListener("mouseleave", () => {
  isDrawing = false;
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / pixelSize);
  const y = Math.floor((e.clientY - rect.top) / pixelSize);
  const color = "#000000"; // Oder ein Farbwähler
  socket.emit("place_pixel", { x, y, color });
});

socket.on("init", (data) => {
  pixels = data.pixels;
  gridWidth = data.gridWidth;
  gridHeight = data.gridHeight;
  resizeCanvas();
  drawAllPixels();
});

socket.on("update_pixel", ({ x, y, color }) => {
  pixels[`${x},${y}`] = color;
  drawPixel(x, y, color);
});

socket.on("canvas_resized", ({ width, height }) => {
  gridWidth = width;
  gridHeight = height;
  resizeCanvas();
  drawAllPixels();
});

function drawPixel(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
}

function drawAllPixels() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const key in pixels) {
    const [x, y] = key.split(",").map(Number);
    drawPixel(x, y, pixels[key]);
  }
}

function resizeCanvas() {
  canvas.width = gridWidth * pixelSize;
  canvas.height = gridHeight * pixelSize;
}
