const socket = io();
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");
const resizeMenu = document.getElementById("resizeMenu");
const widthInput = document.getElementById("widthInput");
const heightInput = document.getElementById("heightInput");
const applyResize = document.getElementById("applyResize");
const userCountDisplay = document.getElementById("userCount");

let gridWidth = 100;
let gridHeight = 100;
let pixelSize = 10;
let isDrawing = false;

socket.on("init", (data) => {
  gridWidth = data.gridWidth;
  gridHeight = data.gridHeight;
  resizeCanvas();
  for (const key in data.pixels) {
    const [x, y] = key.split(",").map(Number);
    drawPixel(x, y, data.pixels[key]);
  }
});

socket.on("update_pixel", ({ x, y, color }) => {
  drawPixel(x, y, color);
});

socket.on("canvas_resized", ({ width, height }) => {
  gridWidth = width;
  gridHeight = height;
  resizeCanvas();
});

socket.on("user_count", (count) => {
  userCountDisplay.textContent = `👥 ${count} Nutzer online`;
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

canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  placePixel(e);
});
canvas.addEventListener("mousemove", (e) => {
  if (isDrawing) placePixel(e);
});
canvas.addEventListener("mouseup", () => {
  isDrawing = false;
});
canvas.addEventListener("mouseleave", () => {
  isDrawing = false;
});

function placePixel(e) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / pixelSize);
  const y = Math.floor((e.clientY - rect.top) / pixelSize);
  const color = colorPicker.value;
  socket.emit("place_pixel", { x, y, color });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "b") {
    resizeMenu.style.display = resizeMenu.style.display === "none" ? "block" : "none";
    widthInput.value = gridWidth;
    heightInput.value = gridHeight;
  }
});

applyResize.addEventListener("click", () => {
  const newWidth = parseInt(widthInput.value);
  const newHeight = parseInt(heightInput.value);
  if (newWidth > 0 && newHeight > 0) {
    socket.emit("resize_canvas", { width: newWidth, height: newHeight });
    resizeMenu.style.display = "none";
  }
});
