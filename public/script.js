const socket = io();
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");
const resizeBtn = document.getElementById("resizeBtn");
const resizeMenu = document.getElementById("resizeMenu");
const applyResize = document.getElementById("applyResize");
const widthInput = document.getElementById("widthInput");
const heightInput = document.getElementById("heightInput");
const userCountDisplay = document.getElementById("userCount");

let gridWidth = 100;
let gridHeight = 100;
let pixelSize = 8;
let drawing = false;

function resizeCanvas() {
  canvas.width = gridWidth * pixelSize;
  canvas.height = gridHeight * pixelSize;
}

socket.on("init", ({ pixels, gridWidth: gw, gridHeight: gh }) => {
  gridWidth = gw;
  gridHeight = gh;
  resizeCanvas();
  for (const key in pixels) {
    const [x, y] = key.split(",").map(Number);
    drawPixel(x, y, pixels[key]);
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
  userCountDisplay.textContent = "👥 " + count;
});

function drawPixel(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
}

canvas.addEventListener("mousedown", (e) => {
  drawing = true;
  handleDraw(e);
});

canvas.addEventListener("mouseup", () => {
  drawing = false;
});

canvas.addEventListener("mousemove", (e) => {
  if (drawing) handleDraw(e);
});

function handleDraw(e) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / pixelSize);
  const y = Math.floor((e.clientY - rect.top) / pixelSize);
  socket.emit("place_pixel", { x, y, color: colorPicker.value });
}

resizeBtn.addEventListener("click", () => {
  resizeMenu.classList.toggle("hidden");
  widthInput.value = gridWidth;
  heightInput.value = gridHeight;
});

applyResize.addEventListener("click", () => {
  const newWidth = parseInt(widthInput.value);
  const newHeight = parseInt(heightInput.value);
  if (newWidth > 0 && newHeight > 0) {
    socket.emit("resize_canvas", { width: newWidth, height: newHeight });
    resizeMenu.classList.add("hidden");
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "b") {
    resizeBtn.click();
  }
});