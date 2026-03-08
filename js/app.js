import { loadContentIndex, getTechnology, getCategory, getDeck } from "./content-service.js";
import { createRouter } from "./router.js";
import { renderShell, renderHome, renderTechnology, renderCategory, renderLegalPage, renderNotFound } from "./renderers.js";
import { mountSlideshow } from "./slideshow.js";
import { toTitle, toRouteSegment } from "./utils.js";

const app = document.getElementById("app");
let cleanupSlideshow = null;

function resetInteractiveState() {
  if (cleanupSlideshow) {
    cleanupSlideshow();
    cleanupSlideshow = null;
  }
}

function setView({ breadcrumbs, html, afterRender }) {
  resetInteractiveState();
  app.innerHTML = renderShell({ breadcrumbs, contentHtml: html });
  if (typeof afterRender === "function") {
    const main = app.querySelector(".site-main");
    cleanupSlideshow = afterRender(main);
  }
}

function startApp(index) {
  const router = createRouter((route) => {
    if (route.type === "home") {
      setView({
        breadcrumbs: [{ label: "Home" }],
        html: renderHome(index)
      });
      return;
    }

    if (route.type === "technology") {
      const tech = getTechnology(index, route.tech);
      if (!tech) {
        setView({ breadcrumbs: [{ label: "Not Found" }], html: renderNotFound() });
        return;
      }
      setView({
        breadcrumbs: [
          { label: "Home", href: "#/" },
          { label: toTitle(tech.name) }
        ],
        html: renderTechnology(tech)
      });
      return;
    }

    if (route.type === "category") {
      const tech = getTechnology(index, route.tech);
      const category = getCategory(tech, route.category);
      if (!tech || !category) {
        setView({ breadcrumbs: [{ label: "Not Found" }], html: renderNotFound() });
        return;
      }
      setView({
        breadcrumbs: [
          { label: "Home", href: "#/" },
          { label: toTitle(tech.name), href: `#/tech/${toRouteSegment(tech.name)}` },
          { label: toTitle(category.name) }
        ],
        html: renderCategory(tech, category)
      });
      return;
    }

    if (route.type === "slideshow") {
      const tech = getTechnology(index, route.tech);
      const deck = getDeck(tech, route.deck);
      if (!tech || !deck) {
        setView({ breadcrumbs: [{ label: "Not Found" }], html: renderNotFound() });
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

    if (route.type === "legal") {
      setView({
        breadcrumbs: [
          { label: "Home", href: "#/" },
          { label: "Legal" }
        ],
        html: renderLegalPage(route.page)
      });
      return;
    }

    setView({ breadcrumbs: [{ label: "Not Found" }], html: renderNotFound() });
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
