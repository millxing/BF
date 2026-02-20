# AGENTS.md

## Project Summary
- This repo is a static blog-style site for Brookline finance resources.
- Stack: plain `HTML`, `CSS`, `JS` (no build step, no framework).
- Main index page renders post cards from a JS array and links to per-post detail pages.

## Key Files
- `/Users/robschoen/Dropbox/CC/BF/index.html`: homepage shell and post-card template.
- `/Users/robschoen/Dropbox/CC/BF/script.js`: source of truth for post list/order.
- `/Users/robschoen/Dropbox/CC/BF/styles.css`: shared styles and theme variables.
- `/Users/robschoen/Dropbox/CC/BF/*.html`: detail pages for each post.
- `/Users/robschoen/Dropbox/CC/BF/docs/`: local PDFs and related assets.

## Post Workflow
1. Add a new post object at the top of `posts` in `/Users/robschoen/Dropbox/CC/BF/script.js`.
2. Create a matching detail page `*.html` in repo root.
3. Set `resourcePage` in the post object to that detail page filename.
4. Confirm links, embed source, and text formatting.

## Post Object Format
Use this shape in `script.js`:

```js
{
  id: 9, // unique id; does not control display order
  title: "Post title",
  category: "journal",
  date: "February 20, 2026",
  excerpt: "Short summary for card.",
  resourcePage: "my_post_20260220.html"
}
```

Notes:
- Display order is array order, not `id`.
- Keep `id` unique.
- To keep quote marks in excerpts, use escaped quotes:
  - `excerpt: "\"Quoted text here.\""`

## Detail Page Template
- Keep this structure:
  - back link: `.back-link`
  - title: `.detail-title`
  - optional subtitle: `.detail-subtitle`
  - body paragraphs: `.detail-copy`
  - embedded content: `iframe.embed-frame`
- If embedding external sites, include a fallback direct link because some sites block iframes.
- For local PDFs in `/docs`, use URL-encoded paths in `href`/`src` when filenames contain spaces or symbols.

## Styling Rules
- Global theme variables live under `:root` in `/Users/robschoen/Dropbox/CC/BF/styles.css`.
- Current font: `Varela Round` (loaded via Google Fonts in all HTML pages).
- Homepage is single-column post layout.
- Keep shared classes (`detail-*`, `post-*`) consistent across pages.

## Naming Conventions
- Detail pages: lowercase with underscores and date suffix when possible, e.g.:
  - `topic_name_YYYYMMDD.html`
- Keep resourcePage filenames exact (case-sensitive on many hosts).

## Quick Validation Checklist
- `node --check /Users/robschoen/Dropbox/CC/BF/script.js`
- Verify new post appears on homepage and opens correct detail page.
- Verify embed loads; if not, fallback link works.
- Check for obvious typos in title/subtitle/date.

## GitHub Pages Notes
- Repo URL pattern: `https://<user>.github.io/<repo>/`
- For this repo: `https://millxing.github.io/BF/`
- In GitHub settings, Pages source should be `main` + `/(root)` unless a workflow is used.
