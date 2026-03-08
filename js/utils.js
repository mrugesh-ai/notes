const KNOWN_CATEGORY_ORDER = ["cheatsheets", "interview", "books", "slides"];

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function toTitle(raw) {
  return String(raw)
    .replace(/\.[^/.]+$/, "")
    .replaceAll(/[-_]+/g, " ")
    .replaceAll(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function toRouteSegment(raw) {
  return encodeURIComponent(String(raw));
}

export function fromRouteSegment(raw) {
  return decodeURIComponent(String(raw));
}

export function naturalCompare(a, b) {
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
}

export function sortCategoryKeys(keys) {
  return [...keys].sort((a, b) => {
    const ai = KNOWN_CATEGORY_ORDER.indexOf(a);
    const bi = KNOWN_CATEGORY_ORDER.indexOf(b);
    if (ai >= 0 && bi >= 0) return ai - bi;
    if (ai >= 0) return -1;
    if (bi >= 0) return 1;
    return naturalCompare(a, b);
  });
}

export function extensionOf(filename) {
  const m = String(filename).toLowerCase().match(/\.([a-z0-9]+)$/);
  return m ? m[1] : "";
}

export function resourceType(filename) {
  const ext = extensionOf(filename);
  if (ext === "pdf") return "PDF";
  if (["png", "jpg", "jpeg", "webp", "svg", "gif", "avif"].includes(ext)) return "Image";
  return ext ? ext.toUpperCase() : "File";
}
