let draggedPiece = null;

// Enable dragging for all puzzle pieces
document.querySelectorAll(".puzzle-piece").forEach(piece => {
  piece.addEventListener("dragstart", function (e) {
    draggedPiece = this;
  });
});

// Allow dropping on grid squares
document.querySelectorAll(".puzzle-grid-drop").forEach(grid => {
  grid.addEventListener("dragover", function (e) {
    e.preventDefault(); // needed so drop is allowed
  });

  grid.addEventListener("drop", function (e) {
    e.preventDefault();
    if (!draggedPiece) return;

    // place the piece exactly where the grid square is
    draggedPiece.style.left = this.style.left;
    draggedPiece.style.top = this.style.top;

    // optional: snap piece inside grid visually
    draggedPiece.style.position = "absolute";

    draggedPiece = null;
  });
});
