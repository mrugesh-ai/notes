import { escapeHtml, toTitle } from "./utils.js";

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

export function mountSlideshow(container, { technologyName, deckName, slides }) {
  let index = 0;
  const total = slides.length;

  if (total === 0) {
    container.innerHTML = `<div class="notice error">No slides were found in this deck.</div>`;
    return () => {};
  }

  const title = `${toTitle(deckName)} Slides`;
  const root = document.createElement("section");
  root.className = "slideshow";
  root.innerHTML = `
    <div class="page-head">
      <h2 class="page-title">${escapeHtml(title)}</h2>
      <p class="page-desc">${escapeHtml(toTitle(technologyName))}</p>
    </div>
    <div class="slideshow-head">
      <span id="slideCounter" class="pill">1 / ${total}</span>
      <a class="btn btn-secondary" href="#/tech/${encodeURIComponent(technologyName)}/slides">Back to decks</a>
    </div>
    <div class="slideshow-stage">
      <img id="slideImage" alt="${escapeHtml(title)}" loading="eager">
    </div>
    <div class="slideshow-controls">
      <button type="button" class="btn btn-secondary" data-action="prev">Previous</button>
      <button type="button" class="btn btn-primary" data-action="next">Next</button>
    </div>
  `;

  container.replaceChildren(root);

  const image = root.querySelector("#slideImage");
  const counter = root.querySelector("#slideCounter");
  const prevBtn = root.querySelector("[data-action='prev']");
  const nextBtn = root.querySelector("[data-action='next']");

  function preloadAround(current) {
    [current - 1, current + 1].forEach((i) => {
      if (i >= 0 && i < total) {
        const pre = new Image();
        pre.src = slides[i].path;
      }
    });
  }

  function render() {
    index = clamp(index, 0, total - 1);
    image.src = slides[index].path;
    image.alt = `${title} (${index + 1}/${total})`;
    counter.textContent = `${index + 1} / ${total}`;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === total - 1;
    preloadAround(index);
  }

  function onClick(event) {
    const btn = event.target.closest("[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === "prev") index -= 1;
    if (action === "next") index += 1;
    render();
  }

  function onKey(event) {
    if (event.key === "ArrowLeft") {
      index -= 1;
      render();
    }
    if (event.key === "ArrowRight") {
      index += 1;
      render();
    }
  }

  root.addEventListener("click", onClick);
  window.addEventListener("keydown", onKey);
  render();

  return () => {
    root.removeEventListener("click", onClick);
    window.removeEventListener("keydown", onKey);
  };
}
