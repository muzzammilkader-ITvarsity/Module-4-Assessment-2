// api.js
// Drag + Drop fix for <img> grid targets

(function () {
  let draggedPiece = null;

  function getComputedLeftTop(el) {
    const cs = window.getComputedStyle(el);
    let left = cs.left;
    let top = cs.top;
    if (!left || left === "auto") left = el.offsetLeft + "px";
    if (!top || top === "auto") top = el.offsetTop + "px";
    return { left, top };
  }

  function init() {
    // --- Make pieces draggable ---
    document.querySelectorAll(".puzzle-piece").forEach(piece => {
      const start = getComputedLeftTop(piece);
      piece.dataset.startLeft = start.left;
      piece.dataset.startTop = start.top;

      piece.addEventListener("dragstart", function (e) {
        draggedPiece = this;
        const cur = getComputedLeftTop(draggedPiece);
        draggedPiece.dataset.startLeft = cur.left;
        draggedPiece.dataset.startTop = cur.top;

        try { e.dataTransfer.setData("text/plain", draggedPiece.id || ""); } catch (err) {}
        e.dataTransfer.effectAllowed = "move";
      });

      piece.addEventListener("dragend", function () {
        draggedPiece = null;
      });
    });

    // --- Make grid cells accept drops (fix for <img>) ---
    document.querySelectorAll(".puzzle-grid-drop").forEach(grid => {
      grid.addEventListener("dragover", function (e) {
        e.preventDefault(); // allow drop
      });

      grid.addEventListener("drop", function (e) {
        e.preventDefault();

        if (!draggedPiece) {
          const id = e.dataTransfer.getData("text/plain");
          if (id) draggedPiece = document.getElementById(id);
        }
        if (!draggedPiece) return;

        // Snap piece to grid square position
        const rect = this.getBoundingClientRect();
        const bodyRect = document.body.getBoundingClientRect();
        const left = rect.left - bodyRect.left + "px";
        const top = rect.top - bodyRect.top + "px";

        draggedPiece.style.position = "absolute";
        draggedPiece.style.left = left;
        draggedPiece.style.top = top;

        draggedPiece = null;
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
