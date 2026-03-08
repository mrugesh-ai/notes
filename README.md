# Dev Resource Library Website

Static developer resource library built with HTML, CSS, and vanilla JavaScript.

## Structure

- `index.html` - single-page shell
- `css/` - base, layout, and component styles
- `js/` - app logic, router, content loader, renderers, slideshow
- `data/content.json` - generated content index consumed by the app
- `content/` - actual resources (files and slide decks)
- `scripts/generate-content-index.mjs` - regenerates `data/content.json`

## Local use

This is a static website. Open `index.html` from a static server.

Example:

```bash
npx serve .
```

## Add new resources

1. Place files in `content/<technology>/<category>/...`
2. For slides, use `content/<technology>/slides/<deck>/01.png` style ordering
3. Regenerate index:

```bash
node scripts/generate-content-index.mjs
```

4. Commit updated `content/` and `data/content.json`

No manual page creation is needed.
