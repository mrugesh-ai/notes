import { loadContentIndex, getTechnology, getCategory, getDeck } from "./content-service.js";
import { createRouter } from "./router.js";
import { renderShell, renderHome, renderTechnology, renderCategory, renderLegalPage, renderSearch, renderNotFound } from "./renderers.js";
import { mountSlideshow } from "./slideshow.js";
import { escapeHtml, toTitle, toRouteSegment } from "./utils.js";
import { createSearchEngine } from "./search-service.js";

const app = document.getElementById("app");
let cleanupSlideshow = null;
let cleanupSearchUI = null;

function resetInteractiveState() {
  if (cleanupSlideshow) {
    cleanupSlideshow();
    cleanupSlideshow = null;
  }
  if (cleanupSearchUI) {
    cleanupSearchUI();
    cleanupSearchUI = null;
  }
}

function setView({ breadcrumbs, html, searchQuery = "", searchEngine, afterRender }) {
  resetInteractiveState();
  app.innerHTML = renderShell({ breadcrumbs, contentHtml: html, searchQuery });
  cleanupSearchUI = mountSearchUI(searchEngine);
  if (typeof afterRender === "function") {
    const main = app.querySelector(".site-main");
    cleanupSlideshow = afterRender(main);
  }
}

function mountSearchUI(searchEngine) {
  if (!searchEngine) return null;

  const form = app.querySelector("#siteSearchForm");
  const input = app.querySelector("#siteSearchInput");
  const suggestions = app.querySelector("#searchSuggestions");

  if (!form || !input || !suggestions) return null;

  let timer = null;

  function hideSuggestions() {
    suggestions.hidden = true;
    suggestions.innerHTML = "";
  }

  function renderSuggestions(items) {
    if (items.length === 0) {
      suggestions.innerHTML = '<div class="search-empty">No matches found</div>';
      suggestions.hidden = false;
      return;
    }

    const html = items
      .map((item) => {
        const targetAttrs = item.external ? ' target="_blank" rel="noopener noreferrer"' : "";
        return `
          <a class="search-suggestion-item" href="${escapeHtml(item.href)}"${targetAttrs}>
            <span class="search-suggestion-title">${escapeHtml(item.title)}</span>
            <span class="search-suggestion-meta">${escapeHtml(item.kind)} - ${escapeHtml(item.subtitle)}</span>
          </a>
        `;
      })
      .join("");

    suggestions.innerHTML = html;
    suggestions.hidden = false;
  }

  function runSuggest() {
    const q = input.value.trim();
    if (q.length < 2) {
      hideSuggestions();
      return;
    }
    const items = searchEngine.suggest(q, 7);
    renderSuggestions(items);
  }

  function onInput() {
    clearTimeout(timer);
    timer = window.setTimeout(runSuggest, 110);
  }

  function onSubmit(event) {
    event.preventDefault();
    const q = input.value.trim();
    if (!q) {
      hideSuggestions();
      window.location.hash = "#/search";
      return;
    }
    window.location.hash = `#/search/${encodeURIComponent(q)}`;
  }

  function onDocumentClick(event) {
    if (!form.contains(event.target) && !suggestions.contains(event.target)) {
      hideSuggestions();
    }
  }

  function onInputKeydown(event) {
    if (event.key === "Escape") {
      hideSuggestions();
      input.blur();
    }
  }

  function onSuggestionClick() {
    hideSuggestions();
  }

  form.addEventListener("submit", onSubmit);
  input.addEventListener("input", onInput);
  input.addEventListener("keydown", onInputKeydown);
  suggestions.addEventListener("click", onSuggestionClick);
  document.addEventListener("click", onDocumentClick);

  return () => {
    clearTimeout(timer);
    form.removeEventListener("submit", onSubmit);
    input.removeEventListener("input", onInput);
    input.removeEventListener("keydown", onInputKeydown);
    suggestions.removeEventListener("click", onSuggestionClick);
    document.removeEventListener("click", onDocumentClick);
  };
}

function startApp(index) {
  const searchEngine = createSearchEngine(index);

  const router = createRouter((route) => {
    if (route.type === "home") {
      setView({
        breadcrumbs: [{ label: "Home" }],
        html: renderHome(index),
        searchEngine
      });
      return;
    }

    if (route.type === "technology") {
      const tech = getTechnology(index, route.tech);
      if (!tech) {
        setView({ breadcrumbs: [{ label: "Not Found" }], html: renderNotFound(), searchEngine });
        return;
      }
      setView({
        breadcrumbs: [
          { label: "Home", href: "#/" },
          { label: toTitle(tech.name) }
        ],
        html: renderTechnology(tech),
        searchEngine
      });
      return;
    }

    if (route.type === "category") {
      const tech = getTechnology(index, route.tech);
      const category = getCategory(tech, route.category);
      if (!tech || !category) {
        setView({ breadcrumbs: [{ label: "Not Found" }], html: renderNotFound(), searchEngine });
        return;
      }
      setView({
        breadcrumbs: [
          { label: "Home", href: "#/" },
          { label: toTitle(tech.name), href: `#/tech/${toRouteSegment(tech.name)}` },
          { label: toTitle(category.name) }
        ],
        html: renderCategory(tech, category),
        searchEngine
      });
      return;
    }

    if (route.type === "slideshow") {
      const tech = getTechnology(index, route.tech);
      const deck = getDeck(tech, route.deck);
      if (!tech || !deck) {
        setView({ breadcrumbs: [{ label: "Not Found" }], html: renderNotFound(), searchEngine });
        return;
      }
      setView({
        breadcrumbs: [
          { label: "Home", href: "#/" },
          { label: toTitle(tech.name), href: `#/tech/${toRouteSegment(tech.name)}` },
          { label: "Slides", href: `#/tech/${toRouteSegment(tech.name)}/slides` },
          { label: toTitle(deck.name) }
        ],
        html: '<section id="slideshowMount"></section>',
        searchEngine,
        afterRender(main) {
          const mount = main.querySelector("#slideshowMount");
          return mountSlideshow(mount, {
            technologyName: tech.name,
            deckName: deck.name,
            slides: deck.slides
          });
        }
      });
      return;
    }

    if (route.type === "search") {
      const query = String(route.query || "").trim();
      const results = query ? searchEngine.search(query, 30) : [];
      setView({
        breadcrumbs: [
          { label: "Home", href: "#/" },
          { label: "Search" }
        ],
        html: renderSearch({ query, results }),
        searchQuery: query,
        searchEngine
      });
      return;
    }

    if (route.type === "legal") {
      setView({
        breadcrumbs: [
          { label: "Home", href: "#/" },
          { label: "Legal" }
        ],
        html: renderLegalPage(route.page),
        searchEngine
      });
      return;
    }

    setView({ breadcrumbs: [{ label: "Not Found" }], html: renderNotFound(), searchEngine });
  });

  router.start();
}

async function init() {
  app.innerHTML = `
    <header class="site-header"><div class="header-inner"><h1 class="site-title">Dev Resource Library</h1></div></header>
    <main class="site-main"><div class="notice">Loading content index...</div></main>
  `;

  try {
    const index = await loadContentIndex();
    startApp(index);
  } catch (error) {
    app.innerHTML = renderShell({
      breadcrumbs: [{ label: "Error" }],
      searchQuery: "",
      contentHtml: `
        <section class="notice error">
          <h2 class="page-title">Failed to load content</h2>
          <p>${error.message}</p>
          <p>Check <code>data/content.json</code> formatting and file paths.</p>
        </section>
      `
    });
  }
}

init();
