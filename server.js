// ... bereits vorhandener Code oben

socket.on("resize_canvas", ({ width, height }) => {
  // Merke: alte Pixel bleiben erhalten!
  if (width > gridWidth) gridWidth = width;
  if (height > gridHeight) gridHeight = height;
  io.emit("canvas_resized", { width: gridWidth, height: gridHeight });
  save();
});
