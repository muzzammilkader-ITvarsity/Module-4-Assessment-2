// api.js
// Handles drag & drop only

(function () {
  let draggedPiece = null;

  // Helper: get left/top safely
  function getComputedLeftTop(el) {
    const cs = window.getComputedStyle(el);
    let left = cs.left;
    let top = cs.top;
    if (!left || left === "auto") left = el.offsetLeft + "px";
    if (!top || top === "auto") top = el.offsetTop + "px";
    return { left, top };
  }

  function init() {
    // Make puzzle pieces draggable
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

        draggedPiece.style.zIndex = 1000;
      });

      piece.addEventListener("dragend", function () {
        setTimeout(() => { draggedPiece = null; }, 0);
        this.style.zIndex = "";
      });
    });

    // Allow grid cells to accept drops
    document.querySelectorAll(".puzzle-grid-drop").forEach(grid => {
      grid.addEventListener("dragover", function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      });

      grid.addEventListener("drop", function (e) {
        e.preventDefault();

        if (!draggedPiece) {
          const id = e.dataTransfer.getData("text/plain");
          if (id) draggedPiece = document.getElementById(id);
        }
        if (!draggedPiece) return;

        const gridPos = getComputedLeftTop(this);
        const targetLeft = gridPos.left;
        const targetTop = gridPos.top;

        let occupyingPiece = null;
        document.querySelectorAll(".puzzle-piece").forEach(p => {
          if (p === draggedPiece) return;
          const pos = getComputedLeftTop(p);
          if (pos.left === targetLeft && pos.top === targetTop) occupyingPiece = p;
        });

        const originalLeft = draggedPiece.dataset.startLeft;
        const originalTop = draggedPiece.dataset.startTop;

        if (occupyingPiece) {
          occupyingPiece.style.position = "absolute";
          occupyingPiece.style.left = originalLeft;
          occupyingPiece.style.top = originalTop;
          occupyingPiece.dataset.startLeft = originalLeft;
          occupyingPiece.dataset.startTop = originalTop;
        }

        draggedPiece.style.position = "absolute";
        draggedPiece.style.left = targetLeft;
        draggedPiece.style.top = targetTop;
        draggedPiece.dataset.startLeft = targetLeft;
        draggedPiece.dataset.startTop = targetTop;

        draggedPiece.style.zIndex = "";
        draggedPiece = null;
      });
    });

    // Drop outside grid → return to start
    document.addEventListener("drop", function () {
      if (!draggedPiece) return;
      const left = draggedPiece.dataset.startLeft;
      const top = draggedPiece.dataset.startTop;
      draggedPiece.style.position = "absolute";
      draggedPiece.style.left = left;
      draggedPiece.style.top = top;
      draggedPiece.style.zIndex = "";
      draggedPiece = null;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
