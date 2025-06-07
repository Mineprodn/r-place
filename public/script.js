const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const fs = require("fs");

let pixels = {};
let gridWidth = 100;
let gridHeight = 100;

try {
  const saved = JSON.parse(fs.readFileSync("canvas_data.json"));
  pixels = saved.pixels || {};
  gridWidth = saved.width || 100;
  gridHeight = saved.height || 100;
} catch (e) {}

app.use(express.static("public"));

io.on("connection", (socket) => {
  io.emit("user_count", io.engine.clientsCount);
  socket.emit("init", { pixels, gridWidth, gridHeight });

  socket.on("place_pixel", ({ x, y, color }) => {
    pixels[`${x},${y}`] = color;
    io.emit("update_pixel", { x, y, color });
    save();
  });

  socket.on("resize_canvas", ({ width, height }) => {
    gridWidth = width;
    gridHeight = height;
    io.emit("canvas_resized", { width, height });
    save();
  });

  socket.on("disconnect", () => {
    io.emit("user_count", io.engine.clientsCount);
  });
});

function save() {
  fs.writeFileSync("canvas_data.json", JSON.stringify({
    pixels, width: gridWidth, height: gridHeight
  }));
}

http.listen(3000, () => {
  console.log("Server läuft auf http://localhost:3000");
});
