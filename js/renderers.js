import { escapeHtml, resourceType, toRouteSegment, toTitle } from "./utils.js";

const LEGAL_PAGES = {
  disclaimer: {
    title: "Disclaimer",
    body: `
      <p>This website curates links and files from publicly available learning resources.</p>
      <ul>
        <li>The site does not claim ownership of third-party materials.</li>
        <li>Copyright remains with the original owners.</li>
        <li>Any content can be removed upon a valid request.</li>
      </ul>
      <p>Removal requests: <a href="mailto:mrugeshp.ai@gmail.com">mrugeshp.ai@gmail.com</a></p>
    `
  },
  privacy: {
    title: "Privacy Policy",
    body: `
      <p>This website does not collect personal data or run user account systems.</p>
      <ul>
        <li>No personal information is stored through this site.</li>
        <li>If you send an email, details may be retained only to handle communication.</li>
      </ul>
    `
  },
  copyright: {
    title: "Copyright / Removal Policy",
    body: `
      <p>This site acts as a curated directory of developer resources.</p>
      <ul>
        <li>Copyright owners can request removal of specific content.</li>
        <li>Requests should include proof of ownership and affected file links.</li>
        <li>Reported content will be removed after verification.</li>
      </ul>
      <p>Contact: <a href="mailto:mrugeshp.ai@gmail.com">mrugeshp.ai@gmail.com</a></p>
    `
  },
  contact: {
    title: "Contact",
    body: `
      <p>For attribution updates, correction requests, or removal requests, contact:</p>
      <p><a href="mailto:mrugeshp.ai@gmail.com">mrugeshp.ai@gmail.com</a></p>
    `
  }
};

function createCard({ title, meta, href, hint, external = false }) {
  const shellTag = href ? "a" : "article";
  const className = href ? "card card-link" : "card";
  const attrs = href
    ? ` href="${escapeHtml(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}`
    : "";
  const hintHtml = hint ? `<p class="card-hint">${escapeHtml(hint)}</p>` : "";

  return `
    <${shellTag} class="${className}"${attrs}>
      <h3 class="card-title">${escapeHtml(title)}</h3>
      <p class="card-meta">${escapeHtml(meta)}</p>
      ${hintHtml}
    </${shellTag}>
  `;
}

export function renderShell({ breadcrumbs, contentHtml, searchQuery = "" }) {
  const crumbsHtml = breadcrumbs.length
    ? `<nav class="breadcrumbs">${breadcrumbs
        .map((item, i) => (item.href ? `<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>${i < breadcrumbs.length - 1 ? " / " : ""}` : `${escapeHtml(item.label)}`))
        .join("")}</nav>`
    : "";

  return `
    <header class="site-header">
      <div class="header-inner">
        <div class="header-top">
          <div class="site-brand">
            <h1 class="site-title"><a href="#/">Dev Resource Library</a></h1>
            <p class="site-byline">by <strong>Mrugesh.AI</strong></p>
          </div>
          <form class="site-search" id="siteSearchForm" role="search" autocomplete="off">
            <input id="siteSearchInput" class="site-search-input" type="search" name="q" placeholder="Search resources, topics, decks..." value="${escapeHtml(searchQuery)}" aria-label="Search resources">
            <button class="btn btn-secondary site-search-btn" type="submit">Search</button>
          </form>
        </div>
        ${crumbsHtml}
        <div id="searchSuggestions" class="search-suggestions" hidden></div>
      </div>
    </header>
    <main class="site-main">${contentHtml}</main>
    <footer class="site-footer">
      <div class="footer-inner">
        <nav class="footer-links">
          <a href="#/">Home</a>
          <a href="#/legal/disclaimer">Disclaimer</a>
          <a href="#/legal/privacy">Privacy Policy</a>
          <a href="#/legal/copyright">Copyright / Removal Policy</a>
          <a href="#/legal/contact">Contact</a>
        </nav>
      </div>
    </footer>
  `;
}

export function renderHome(index) {
  const cards = index.technologies
    .map((tech) =>
      createCard({
        title: toTitle(tech.name),
        meta: `${tech.categories.length} categories`,
        href: `#/tech/${toRouteSegment(tech.name)}`,
        hint: "Explore resources"
      })
    )
    .join("");

  return `
    <section class="page-head">
      <h2 class="page-title">Developer Resource Library</h2>
      <p class="page-desc">Curated by Mrugesh.AI. Browse technologies and access cheatsheets, books, interview prep, and slide decks.</p>
    </section>
    <section class="grid">
      ${cards || '<div class="notice">No technologies found. Add folders under <code>content/</code> and update <code>data/content.json</code>.</div>'}
    </section>
  `;
}

export function renderTechnology(tech) {
  const cards = tech.categories
    .map((category) => {
      const count = category.kind === "slides" ? `${category.decks.length} decks` : `${category.resources.length} files`;
      return createCard({
        title: toTitle(category.name),
        meta: count,
        href: `#/tech/${toRouteSegment(tech.name)}/${toRouteSegment(category.name)}`,
        hint: "Open category"
      });
    })
    .join("");

  return `
    <section class="page-head">
      <h2 class="page-title">${escapeHtml(toTitle(tech.name))}</h2>
      <p class="page-desc">Available categories generated from repository content.</p>
    </section>
    <section class="grid">${cards || '<div class="notice">No categories found for this technology.</div>'}</section>
  `;
}

export function renderCategory(tech, category) {
  if (category.kind === "slides") {
    const cards = category.decks
      .map((deck) =>
        createCard({
          title: toTitle(deck.name),
          meta: `${deck.slideCount} slides`,
          href: `#/slides/${toRouteSegment(tech.name)}/${toRouteSegment(deck.name)}`,
          hint: "Start slideshow"
        })
      )
      .join("");

    return `
      <section class="page-head">
        <h2 class="page-title">${escapeHtml(toTitle(tech.name))} / Slides</h2>
        <p class="page-desc">Image decks are ordered by filename and opened in the built-in viewer.</p>
      </section>
      <section class="grid">${cards || '<div class="notice">No slide decks found in this category.</div>'}</section>
    `;
  }

  const cards = category.resources
    .map((resource) =>
      createCard({
        title: toTitle(resource.filename),
        meta: resourceType(resource.filename),
        href: resource.path,
        hint: "Open resource",
        external: true
      })
    )
    .join("");

  return `
    <section class="page-head">
      <h2 class="page-title">${escapeHtml(toTitle(tech.name))} / ${escapeHtml(toTitle(category.name))}</h2>
      <p class="page-desc">Resources are listed automatically from <code>data/content.json</code>.</p>
    </section>
    <section class="grid">${cards || '<div class="notice">No resources found in this category.</div>'}</section>
  `;
}

export function renderLegalPage(slug) {
  const page = LEGAL_PAGES[slug];
  if (!page) {
    return `<div class="notice error">Legal page not found.</div>`;
  }
  return `
    <article class="legal-block">
      <h2>${escapeHtml(page.title)}</h2>
      ${page.body}
    </article>
  `;
}

export function renderSearch({ query, results }) {
  const cleanQuery = String(query || "").trim();
  if (!cleanQuery) {
    return `
      <section class="page-head">
        <h2 class="page-title">Search</h2>
        <p class="page-desc">Type at least 2 characters in the search box to find technologies, categories, decks, and resources.</p>
      </section>
      <section class="notice">Try searches like <code>javascript</code>, <code>interview</code>, <code>promises</code>, or <code>slides</code>.</section>
    `;
  }

  const cards = results
    .map((item) =>
      createCard({
        title: item.title,
        meta: `${item.kind} - ${item.subtitle}`,
        href: item.href,
        hint: item.external ? "Open resource" : "Open result",
        external: item.external
      })
    )
    .join("");

  return `
    <section class="page-head">
      <h2 class="page-title">Search: ${escapeHtml(cleanQuery)}</h2>
      <p class="page-desc">${results.length} result${results.length === 1 ? "" : "s"} found.</p>
    </section>
    <section class="grid">
      ${cards || '<div class="notice">No matching results. Try a broader keyword.</div>'}
    </section>
  `;
}

export function renderNotFound() {
  return `
    <section class="notice error">
      <h2 class="page-title">Page not found</h2>
      <p>The requested route does not exist. Go back to <a href="#/">Home</a>.</p>
    </section>
  `;
}
