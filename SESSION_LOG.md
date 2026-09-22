# Session Log — The Muse

Append-only. **Newest entry first.**

---

## 2026-09-22 — Phase 1: research system, 14 memos, first trail written, drafts, renamed

**What happened.** Worked the 8 queued KJV questions with parallel researcher agents, then 6 follow-ups: 14 memos in `research/`, each with a verified claims table, a working log and a sources list. Built the pieces around the research: working logs, a local source library, and a **writer** agent (`.claude/agents/writer.md`) that turns verified memo rows into vault pages and never researches. Wrote the first trail, **47 nodes** (34 researched, 13 seed stubs), then folded the follow-up memos into the affected pages. Renamed the site **Following the Muse**. Added a drafts system. Committed in four commits (`172428d` `d7491fb` `75132d2` `cc13deb`) and pushed.

**Decisions (Matt).**
- Name: **Following the Muse** (channel and site); repo/folder stay `themuse`.
- **Editorial thesis revised** to the Copenhaver framing: the KJV was "translated while learned magic still held the serious attention of Europe's philosophers", with Dee and Fludd active and Andrewes, a translator, the closest friend of Casaubon. Why: the research didn't support "high era of Hermeticism and Christian Cabala". No source says it, the "Hermetic tradition" is itself contested (Hanegraaff, Copenhaver), and no documented link ties the translators to Hermetic or Cabalist learning. Recorded with a dated note in CLAUDE.md.
- Source documents stay **local only**: `vault/sources/` is gitignored, and `npm run sources` rebuilds it from the committed manifests. Why: scans run to hundreds of MB and one is over GitHub's 100 MB limit. `research/SOURCES.md` (committed) lists every source with a download link or where to get it.
- **Drafts:** only `reviewed: true` pages publish (a checkbox in Obsidian). Drafts are hidden from both `npm run dev` and `npm run build`; `dev:drafts` / `build:drafts` show them with a banner. Agents never set `reviewed: true`.
- Seven page calls settled (all kept as written; Wicked Bible surviving-copy estimates restored as a dated list). Voice pass: Matt, while reading.
- **Episode plan:** the KJV is **episode 1, a single episode**, ending on the lead into **Hermeticism as episode 2**.
- Hermeticism is the next trail; a `hermeticism` gateway page exists from the current memos only. No research on it until the KJV trail is done.

**Findings that changed pages.** The Dee refusal is **Contested**, not established: it traces only to Thomas Smith's hedged 1707 life, and Cecil wasn't Earl of Salisbury until 1605. Corrected on six pages. Burntisland 1601: the record credits "sundrie of the brethren"; James urging a translation rests on Spottiswoode alone. Casaubon's 1614 argument was read from the book itself (pp. 70–87), with the English as working translations pending a Latinist.

**Artifacts.** `research/2026-09-22-*.md` (14 memos), `research/logs/`, `research/sources/*.json`, `research/SOURCES.md`, `research/OPEN-ITEMS.md` (everything held back + round-2 candidates), `scripts/fetch-sources.mjs`, `scripts/with-drafts.mjs`, `.claude/agents/writer.md`, `vault/.obsidian/types.json`, 44 new vault nodes + 3 rewritten.

**Lessons.** Messaging running agents mid-run with "reconstruct the steps you've taken" tripped the safety filter (`reasoning_extraction`) on six agents; new rules go in at spawn only, and logs record actions, not thinking. One agent overflowed its context on a whole PDF; prompts now forbid reading whole books/PDFs. The session's 200 web searches ran out mid-batch; later agents worked from fetchable search endpoints (archive.org advancedsearch/full-text, Wikisource, OpenAlex, Crossref) and did fine. I stopped Matt's running dev server by mistake while testing; restarted it.

**Still open.** Matt's read-through + voice pass, ticking `reviewed`. Round-2 research candidates in `research/OPEN-ITEMS.md`. Two sources over the 50 MB cap (Ellis 1843, Smith 1707) not downloaded.

---

## 2026-09-22 — Public repo, MIT, research queue, README

**What happened.** Matt opened the vault in Obsidian and confirmed it looks right (templates, links, graph colors). Obsidian left the committed config untouched; `.gitignore` extended for per-device files (`appearance.json`, `workspaces.json`, `themes/`, `snippets/`). First commit made on `main` (renamed from `master`) and pushed to a new **public** repo, github.com/mattglbrt/themuse (Matt: "i want people to be able to clone it"). Pre-publish scan found no emails, client names or local paths. Licensed **MIT** for everything Matt wrote, vault content included (Matt: "i want to give everything away"); `NOTICE.md` carries the exceptions (OFL fonts, third-party images in `vault/assets/`, quoted works), kept out of `LICENSE` so GitHub detects it as MIT. Added a research queue (`research/QUEUE.md`) and reworked `/research`: `/research add <q>` queues, bare `/research` works the queue (dedupes against existing memos, max 4 parallel, ticks as memos land). README written for the public repo: quick start, using the site, authoring in Obsidian, how the pipeline works, the research agents, the rigor tiers.

**Decisions.**
- Repo public + MIT; CLAUDE.md now carries an "open by design" rule: never commit anything private.
- Queue stays in `research/` (outside the vault, so Obsidian can't see it). Offered to move it into the vault; not taken up yet.

**In flight (not mine, not committed).** A research run Matt started from the old STATUS list is working the KJV questions in another session. It has written memos (`2026-09-22-hermeticism-cabala-england.md`, `2026-09-22-yates-thesis-historiography.md`, `2026-09-22-daemonologie.md`) and is ticking `QUEUE.md` in its own format (inline tick, not moved to Done). Left untouched and uncommitted until that run finishes.

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
