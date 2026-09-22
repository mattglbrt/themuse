# Session Log — The Muse

Append-only. **Newest entry first.**

---

## 2026-09-22 — Typography locked (reading spec)

**What happened.** Matt set the site's reading spec; implemented and verified it. Replaced the interim fonts (Cormorant/Source Serif/Source Sans via npm) with **Literata** (body, variable, optical sizing) and **EB Garamond** (headings/display), self-hosted as WOFF2 subsets in `public/fonts/` with our own `@font-face` (`src/styles/fonts.css`), `font-display: swap`, Georgia fallback, regular Latin files preloaded. Interface chrome and graph labels moved to the system sans stack. Added light mode (follows `prefers-color-scheme`, dark default, `data-theme` override) and dark-mode anti-halo (off-white `#e4ddcf`, body weight 370). Prose styles for blockquote, lists, tables, hr, images; bibliography at 0.875em with hanging indent. Graph labels got a background-colored outline (they were colliding with nodes in the local graph).

**Decisions.**
- Measure is `60ch`, not 65–75ch literally: CSS `ch` = width of "0", and Literata letters average narrower, so 60ch measured ~70 real characters per full line (63–77) and 65ch would be ~76. Spec read as 65–75 *characters*. Written into `docs/TYPOGRAPHY.md` so it isn't "fixed" back.
- latin-ext kept as separate on-demand `unicode-range` files: early modern quotation needs ſ and friends; they only download on pages that use them.
- Spec is LOCKED in `docs/TYPOGRAPHY.md`; CLAUDE.md conventions point to it.

**Verified.** Headless Chrome, desktop 1280 + phone 390 × dark + light, on a temporary long specimen page (since deleted): body 20px/18px, line-height 1.65, no horizontal overflow, bibliography and sidebar legible. Font requests all from `/fonts/`, zero external requests; in Matt's Chrome the KJV page loads exactly two font files, one origin. `dist/` has no external font refs. fontTools: Latin files hold ~230 codepoints each (43–110 KB); Literata retains `opsz` + `wght` axes.

**Housekeeping.** Several files had been flipped to CRLF by a Python edit earlier in the session; all normalized back to LF.

---

## 2026-09-22 — Phase 0 scaffold: vault → graph.json → site

**What happened.** Built Phase 0 per brief v1 (decisions not reopened). Astro 7 static site reading `vault/` directly (no content collections): `src/lib/vault.mjs` walks the vault, parses frontmatter + `[[wikilinks]]`/`![[embeds]]` (body and frontmatter values) → `graph.json` (nodes: slug, title, type, status, tags; edges: source→target) → one page per node via a custom remark wikilink plugin (`src/lib/render.mjs`). Canvas + d3-force graph (`src/scripts/graph.js`): global graph as homepage, one-hop local graph on every node page, color by type, size by degree, hover/drag/pan/zoom, click-through, reduced-motion aware, hidden link-list fallback. Backlinks + outlinks on every page from the same graph. `scripts/validate.mjs` runs before every build and fails it on broken links/embeds, orphans, missing/invalid title/type/status, non-kebab filenames, reserved/duplicate slugs. Seeded three stubs (frontmatter + dek only, `status: seed`): `king-james-bible` (book), `james-i` (person), `daemonologie` (book). Deks paraphrase only the brief; no dates or facts beyond it, pending research. Seed pages carry an automatic "not yet researched" notice.

**Decisions.**
- `templates/` moved to `vault/templates/`: Obsidian only accepts a template folder inside the vault. Build skips it; Obsidian excludes it from search/graph. Committed `vault/.obsidian/` config: templates folder, attachments → `assets/`, wikilinks, auto-update links, graph color groups by `[type:…]` matching the site.
- Node URLs are `/<slug>/` (root level); `index`/`assets`/`graph`/`404` reserved, validator enforces.
- `vault/assets/` served at `/assets/` by an endpoint (no copying into `public/`).
- Frontmatter wikilinks count as edges (`author: "[[james-i]]"`), matching Obsidian.
- Brief split: full v1 brief verbatim → `docs/BRIEF.md`; pipeline as built → `docs/ARCHITECTURE.md`; CLAUDE.md slimmed to the standard entrypoint form with the editorial thesis and scholastic-rigor doctrine carried verbatim.

**Verified.** `npm run build` green (3 nodes, 6 edges). Headless Chrome: home graph renders; clicking the KJV node lands on `/king-james-bible/`; its local graph renders with focus ring; clicking James I in the local graph lands on `/james-i/`; backlinks correct. Embeds (incl. `|300` sizing, spaces in names), `[[x#Heading|alias]]`, broken links, and code-block exclusion tested against a throwaway vault; asset route serves `image/png`. Validator tested against a deliberately bad file (all 8 problems caught).

**Post-wrap fix.** In Matt's real Chrome (display scaling above 100%) the graph drew off-center and clicks missed nodes: the canvas had no CSS size, so it displayed at its backing-store size. Fixed in `Graph.astro` (width/height 100%); re-verified in Matt's browser: home graph click → KJV page, local-graph click → James I.

**Post-wrap, per Matt.** Fonts replaced (Matt: the defaults "kind of suck"): self-hosted Cormorant Garamond headings, Source Serif 4 body, Source Sans 3 UI. Global heading rule wrapped in `:where()` so Astro's scoped styles win. Sidebar now shows "Last edited" under Links to, from git commit date (mtime fallback until first commit).

**Not verified.** Opening `vault/` in the Obsidian desktop app (can't drive the GUI from here). Config JSON is valid; Matt to open once and confirm. Obsidian may rewrite `core-plugins.json` in its own format on first open; that's expected.

**Artifacts.** `package.json`, `astro.config.mjs`, `src/` (lib, pages, components, scripts, styles), `scripts/validate.mjs`, `vault/` (3 stubs, `templates/`, `assets/`, `.obsidian/`), `docs/BRIEF.md`, `docs/ARCHITECTURE.md`, `research/`.

---

## 2026-09-22 — Everyway organization standard installed

Repo created via _system/new-project.sh, then scoped with Cowork: build brief v1 written into CLAUDE.md (vault-first design, Obsidian-compatible wikilinked markdown, Quartz-vs-Astro Phase 0 call, citation doctrine incl. history-vs-tradition line, trail = episode structure, KJV seed plan with first-order links). Moved from dev root into mdggrowth/ as a venture; boards + dashboard card added. Editorial thesis captured (Matt): the KJV is most Westerners' first unknowing exposure to occult material and the gateway outward — every episode starts from the familiar and follows documented connections out.
