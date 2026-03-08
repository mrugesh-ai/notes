import Fuse from "../fuse.basic.min.mjs";
import { resourceType, slideDeckLabel, toRouteSegment, toTitle } from "./utils.js";

function buildSearchEntries(index) {
  const entries = [];

  for (const tech of index.technologies) {
    const techTitle = toTitle(tech.name);
    entries.push({
      id: `tech:${tech.name}`,
      kind: "Technology",
      title: techTitle,
      subtitle: `${tech.categories.length} categories`,
      technology: techTitle,
      category: "",
      terms: [tech.name, techTitle].join(" "),
      href: `#/tech/${toRouteSegment(tech.name)}`,
      external: false
    });

    for (const category of tech.categories) {
      const categoryTitle = toTitle(category.name);
      const categoryCount = category.kind === "slides" ? `${category.decks.length} decks` : `${category.resources.length} files`;

      entries.push({
        id: `category:${tech.name}:${category.name}`,
        kind: "Category",
        title: `${techTitle} / ${categoryTitle}`,
        subtitle: categoryCount,
        technology: techTitle,
        category: categoryTitle,
        terms: [tech.name, techTitle, category.name, categoryTitle].join(" "),
        href: `#/tech/${toRouteSegment(tech.name)}/${toRouteSegment(category.name)}`,
        external: false
      });

      if (category.kind === "slides") {
        for (const deck of category.decks) {
          const deckTitle = slideDeckLabel(deck.name);
          entries.push({
            id: `deck:${tech.name}:${deck.name}`,
            kind: "Slides Deck",
            title: deckTitle,
            subtitle: `${techTitle} slides - ${deck.slideCount} slides`,
            technology: techTitle,
            category: "Slides",
            terms: [tech.name, techTitle, "slides", deck.name, deckTitle].join(" "),
            href: `#/slides/${toRouteSegment(tech.name)}/${toRouteSegment(deck.name)}`,
            external: false
          });
        }
        continue;
      }

      for (const resource of category.resources) {
        entries.push({
          id: `resource:${resource.path}`,
          kind: "Resource",
          title: toTitle(resource.filename),
          subtitle: `${techTitle} / ${categoryTitle} - ${resourceType(resource.filename)}`,
          technology: techTitle,
          category: categoryTitle,
          terms: [tech.name, techTitle, category.name, categoryTitle, resource.filename, toTitle(resource.filename)].join(" "),
          href: resource.path,
          external: true
        });
      }
    }
  }

  return entries;
}

export function createSearchEngine(index) {
  const entries = buildSearchEntries(index);
  const fuse = new Fuse(entries, {
    includeScore: true,
    threshold: 0.3,
    ignoreLocation: true,
    minMatchCharLength: 2,
    keys: [
      { name: "title", weight: 0.45 },
      { name: "technology", weight: 0.2 },
      { name: "category", weight: 0.15 },
      { name: "terms", weight: 0.2 }
    ]
  });

  function search(query, limit = 24) {
    const q = String(query || "").trim();
    if (!q) return [];
    return fuse.search(q, { limit }).map((result) => result.item);
  }

  function suggest(query, limit = 7) {
    return search(query, limit);
  }

  return {
    search,
    suggest,
    totalIndexed: entries.length
  };
}
