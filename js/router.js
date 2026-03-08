import { fromRouteSegment } from "./utils.js";

function normalizeHash(rawHash) {
  const cleaned = rawHash.replace(/^#\/?/, "").trim();
  if (!cleaned) return [];
  return cleaned.split("/").filter(Boolean).map(fromRouteSegment);
}

export function createRouter(onRouteChange) {
  function parseRoute() {
    const parts = normalizeHash(window.location.hash);
    if (parts.length === 0) return { type: "home" };

    if (parts[0] === "tech" && parts[1] && !parts[2]) {
      return { type: "technology", tech: parts[1] };
    }
    if (parts[0] === "tech" && parts[1] && parts[2] && !parts[3]) {
      return { type: "category", tech: parts[1], category: parts[2] };
    }
    if (parts[0] === "slides" && parts[1] && parts[2] && !parts[3]) {
      return { type: "slideshow", tech: parts[1], deck: parts[2] };
    }
    if (parts[0] === "legal" && parts[1] && !parts[2]) {
      return { type: "legal", page: parts[1] };
    }
    return { type: "notFound" };
  }

  function handle() {
    onRouteChange(parseRoute());
  }

  window.addEventListener("hashchange", handle);

  return {
    start() {
      handle();
    },
    stop() {
      window.removeEventListener("hashchange", handle);
    }
  };
}
