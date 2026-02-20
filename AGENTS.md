# AGENTS.md

## Project Summary
- This repo is a static blog-style site for Brookline finance resources.
- Stack: plain `HTML`, `CSS`, `JS` (no build step, no framework).
- Main index page is tabbed with 3 views:
  - `Journal`: post cards linked to per-post detail pages
  - `Meetings`: upcoming meetings from local JSON snapshot
  - `Budget Data`: summary table from local JSON

## Key Files
- `/Users/robschoen/Dropbox/CC/BF/index.html`: homepage shell, tab controls, and post-card template.
- `/Users/robschoen/Dropbox/CC/BF/script.js`: render logic/state for all homepage views and post list/order.
- `/Users/robschoen/Dropbox/CC/BF/styles.css`: shared styles and theme variables.
- `/Users/robschoen/Dropbox/CC/BF/*.html`: detail pages for each post.
- `/Users/robschoen/Dropbox/CC/BF/docs/`: local PDFs and related assets.
- `/Users/robschoen/Dropbox/CC/BF/data/meetings.json`: generated meetings snapshot.
- `/Users/robschoen/Dropbox/CC/BF/data/meetings_meta.json`: meetings snapshot metadata (`lastUpdated`, count, source URL).
- `/Users/robschoen/Dropbox/CC/BF/data/budget_summary.json`: summary-level budget rows for the table view.
- `/Users/robschoen/Dropbox/CC/BF/tools/sync_meetings.js`: manual CLI sync from CivicClerk API to local `data/*.json`.

## Journal Post Workflow
1. Add a new post object at the top of `posts` in `/Users/robschoen/Dropbox/CC/BF/script.js`.
2. Create a matching detail page `*.html` in repo root.
3. Set `resourcePage` in the post object to that detail page filename.
4. Confirm links, embed source, and text formatting.

## Meetings Workflow
1. Run `node /Users/robschoen/Dropbox/CC/BF/tools/sync_meetings.js` from repo root.
2. Confirm `data/meetings.json` and `data/meetings_meta.json` were updated.
3. In homepage `Meetings` tab, links shown should be:
   - `Meeting Details` (always preferred)
   - optional `Media` when available
4. `Agenda`/`Packet` links are intentionally not shown on the homepage.

## Budget Workflow
1. Edit `/Users/robschoen/Dropbox/CC/BF/data/budget_summary.json`.
2. Keep rows summary-level and include source labels/URLs when possible.
3. Confirm table sorting and search still behave correctly.

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
- Homepage uses top tabs (`Journal`, `Meetings`, `Budget Data`) with a single shared content mount.
- Keep shared classes (`detail-*`, `post-*`, `meeting-*`, `budget-*`) consistent across pages.

## Naming Conventions
- Detail pages: lowercase with underscores and date suffix when possible, e.g.:
  - `topic_name_YYYYMMDD.html`
- Keep resourcePage filenames exact (case-sensitive on many hosts).

## Quick Validation Checklist
- `node --check /Users/robschoen/Dropbox/CC/BF/script.js`
- `node --check /Users/robschoen/Dropbox/CC/BF/tools/sync_meetings.js`
- Verify new post appears on homepage and opens correct detail page.
- Verify meetings sync runs and `Meetings` tab shows current items.
- Verify `Meeting Details` links resolve and optional `Media` links open when present.
- Verify embed loads; if not, fallback link works.
- Check for obvious typos in title/subtitle/date.
- Preview via local server (not `file://`) for JSON-backed views:
  - `cd /Users/robschoen/Dropbox/CC/BF && python3 -m http.server 8000`

## GitHub Pages Notes
- Repo URL pattern: `https://<user>.github.io/<repo>/`
- For this repo: `https://millxing.github.io/BF/`
- In GitHub settings, Pages source should be `main` + `/(root)` unless a workflow is used.
