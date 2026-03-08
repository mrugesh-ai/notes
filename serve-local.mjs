import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname);
const PORT = Number(process.env.PORT || 3000);

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
  ".txt": "text/plain; charset=utf-8"
};

function safePathFromUrl(urlPath) {
  const cleanPath = urlPath.split("?")[0].split("#")[0];
  const decoded = decodeURIComponent(cleanPath || "/");
  const normalized = path.normalize(decoded).replace(/^([.][.][/\\])+/, "");
  const relative = normalized === path.sep ? "" : normalized.replace(/^[/\\]+/, "");
  return path.join(ROOT, relative);
}

async function resolveFilePath(requestPath) {
  const targetPath = safePathFromUrl(requestPath);

  if (!targetPath.startsWith(ROOT)) {
    return null;
  }

  try {
    const fileInfo = await stat(targetPath);
    if (fileInfo.isDirectory()) {
      return path.join(targetPath, "index.html");
    }
    return targetPath;
  } catch {
    if (path.extname(targetPath)) {
      return null;
    }
    return path.join(targetPath, "index.html");
  }
}

function contentTypeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || "application/octet-stream";
}

const server = createServer(async (req, res) => {
  const reqPath = req.url || "/";
  const filePath = await resolveFilePath(reqPath);

  if (!filePath || !filePath.startsWith(ROOT)) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not Found");
    return;
  }

  try {
    const content = await readFile(filePath);
    res.writeHead(200, { "Content-Type": contentTypeFor(filePath) });
    res.end(content);
  } catch {
    if (reqPath !== "/" && !path.extname(reqPath)) {
      try {
        const fallback = await readFile(path.join(ROOT, "index.html"));
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(fallback);
        return;
      } catch {
      }
    }

    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`Local server running at http://localhost:${PORT}`);
});
