import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content");
const OUTPUT_FILE = path.join(ROOT, "data", "content.json");

function sortNatural(items) {
  return [...items].sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
}

async function listDirectories(dirPath) {
  const items = await readdir(dirPath, { withFileTypes: true });
  return sortNatural(items.filter((d) => d.isDirectory()).map((d) => d.name));
}

async function listFiles(dirPath) {
  const items = await readdir(dirPath, { withFileTypes: true });
  return sortNatural(items.filter((d) => d.isFile()).map((d) => d.name));
}

async function buildIndex() {
  const index = {};
  const technologies = await listDirectories(CONTENT_DIR);

  for (const tech of technologies) {
    const techPath = path.join(CONTENT_DIR, tech);
    const categories = await listDirectories(techPath);
    const techEntry = {};

    for (const category of categories) {
      const categoryPath = path.join(techPath, category);
      if (category === "slides") {
        const decks = await listDirectories(categoryPath);
        const deckMap = {};
        for (const deck of decks) {
          const deckPath = path.join(categoryPath, deck);
          deckMap[deck] = await listFiles(deckPath);
        }
        techEntry[category] = deckMap;
      } else {
        techEntry[category] = await listFiles(categoryPath);
      }
    }

    index[tech] = techEntry;
  }

  await writeFile(OUTPUT_FILE, `${JSON.stringify(index, null, 2)}\n`, "utf8");
  console.log(`Generated: ${path.relative(ROOT, OUTPUT_FILE)}`);
}

buildIndex().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
