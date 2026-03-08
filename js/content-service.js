import { naturalCompare, sortCategoryKeys } from "./utils.js";

function ensureObject(value, context) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Invalid content index at ${context}`);
  }
}

export async function loadContentIndex(path = "data/content.json") {
  const res = await fetch(path, { cache: "no-cache" });
  if (!res.ok) {
    throw new Error(`Failed to load content index: ${res.status}`);
  }
  const json = await res.json();
  return normalizeIndex(json);
}

export function normalizeIndex(raw) {
  ensureObject(raw, "root");

  const technologies = Object.keys(raw).sort(naturalCompare).map((tech) => {
    const techBody = raw[tech];
    ensureObject(techBody, `technology '${tech}'`);

    const categories = sortCategoryKeys(Object.keys(techBody)).map((category) => {
      const categoryBody = techBody[category];
      if (category === "slides") {
        ensureObject(categoryBody, `${tech}.slides`);
        const decks = Object.keys(categoryBody).sort(naturalCompare).map((deck) => {
          const files = Array.isArray(categoryBody[deck]) ? [...categoryBody[deck]] : [];
          files.sort(naturalCompare);
          const slides = files.map((filename) => ({
            filename,
            path: `content/${tech}/slides/${deck}/${filename}`
          }));
          return {
            name: deck,
            slideCount: slides.length,
            slides
          };
        });
        return {
          name: category,
          kind: "slides",
          decks
        };
      }

      const files = Array.isArray(categoryBody) ? [...categoryBody] : [];
      files.sort(naturalCompare);
      const resources = files.map((filename) => ({
        filename,
        path: `content/${tech}/${category}/${filename}`
      }));

      return {
        name: category,
        kind: "files",
        resources
      };
    });

    return {
      name: tech,
      categories
    };
  });

  return { technologies };
}

export function getTechnology(index, techName) {
  return index.technologies.find((t) => t.name === techName) || null;
}

export function getCategory(technology, categoryName) {
  if (!technology) return null;
  return technology.categories.find((c) => c.name === categoryName) || null;
}

export function getDeck(technology, deckName) {
  if (!technology) return null;
  const slidesCategory = technology.categories.find((c) => c.name === "slides" && c.kind === "slides");
  if (!slidesCategory) return null;
  return slidesCategory.decks.find((d) => d.name === deckName) || null;
}
