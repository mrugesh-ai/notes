# Dev Resource Library Website

Static developer resource library built with HTML, CSS, and vanilla JavaScript.
Includes fast fuzzy search powered by Fuse.js.

## Structure

- `index.html` - single-page shell
- `css/` - base, layout, and component styles
- `js/` - app logic, router, content loader, renderers, slideshow
- `js/search-service.js` - builds Fuse.js search index and query helpers
- `fuse.basic.min.mjs` - vendored Fuse.js module used by static hosting (GitHub Pages)
- `data/content.json` - generated content index consumed by the app
- `content/` - actual resources (files and slide decks)
- `scripts/generate-content-index.mjs` - regenerates `data/content.json`

## Local use

This is a static website. Open `index.html` from a static server.

Install dependencies (none will be downloaded, but this keeps usage standard):

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Search:
- Use the header search box from any page
- Live suggestions appear as you type (2+ characters)
- Press Enter to open full results page (`#/search/<query>`)

## Add new resources

1. Place files in `content/<technology>/<category>/...`
2. For slides, use `content/<technology>/slides/<deck>/01.png` style ordering
   - You can also place slide images directly in `content/<technology>/slides/`; they will appear as a default deck.
3. Regenerate index:

```bash
npm run build:index
```

4. Commit updated `content/` and `data/content.json`

No manual page creation is needed.
