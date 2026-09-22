# Typography: the reading spec (LOCKED 2026-09-22)

Set by Matt on 2026-09-22. This is closed: don't swap faces or loosen the measure without Matt reopening it. Colors are still first-pass and belong to the Phase 2 brand pass; type does not.

## Faces

| Role | Face | Where |
|---|---|---|
| Body (reading) | **Literata**, variable, optical sizing on (`opsz` + `wght` axes) | node page prose, dek, bibliography |
| Headings & display | **EB Garamond**, variable (`wght`) | h1–h4, wordmark |
| Interface | **system sans stack** (`system-ui, -apple-system, 'Segoe UI', Roboto, …`) | kicker, status pill, fact box, sidebar, legend, graph labels, tables |

The serifs are for reading; the sans is for interface. Graph labels and all chrome stay on the system stack.

Tokens (`src/styles/global.css`): `--font-body`, `--font-display`, `--font-ui`, `--measure`, `--body-size`, `--body-weight`.

## Loading

- Self-hosted WOFF2 subsets in `public/fonts/`, `@font-face` in `src/styles/fonts.css`. **No Google Fonts, no CDN, no npm font package at runtime.** OFL licenses sit next to the files.
- `font-display: swap`, fallback `Georgia, 'Times New Roman', serif`, so text paints immediately.
- Subsets: **latin** (Basic Latin + Latin-1 + general punctuation, ~230 codepoints, 43–110 KB) loads on every page. **latin-ext** is a separate `unicode-range` file that downloads only when a page uses those characters (ſ, ā, ȝ … in early modern and scholarly quotation). It is not the full family.
- The two regular Latin files are `<link rel="preload">`ed in `Base.astro`. A normal node page loads exactly those two; italics load when used.
- Source of the files: Fontsource's pre-subset builds (`@fontsource-variable/literata`, `…/eb-garamond`), copied in once. To refresh: `npm i --no-save` those packages, copy the `*-latin-opsz-*` / `*-latin-wght-*` (and `-latin-ext-`) files over, keep the `unicode-range` lines in `fonts.css` in step.

## Reading measure

- Body **18–20px** (`clamp(1.125rem, 1.05rem + 0.3vw, 1.25rem)`), line-height **1.65**, paragraph spacing 1.1em.
- Line length **65–75 characters**. Implemented as `--measure: 60ch`, because CSS `ch` is the width of "0" and Literata's average letter is narrower. At 60ch, full lines measured 63–77, averaging ~70 (2026-09-22, desktop). 65ch in CSS would average ~76 real characters, over the cap. Measure real characters per line before changing this.
- Phone: the viewport is the limit (~40 characters at 390px). The spec is a cap, not a floor. 16px side gutter, no horizontal scroll.

## Dark and light

- Follows `prefers-color-scheme`; dark is the default. `data-theme="light|dark"` on `<html>` forces one (for testing or a future toggle).
- Dark mode anti-halo: off-white text `#e4ddcf` on `#141311` (never #fff on #000) **and** body weight 370 instead of 400 (Literata's variable axis). Light mode: `#231f1a` on `#f7f3ea`, weight 400.

## Small sizes (checked 2026-09-22)

- Bibliography: Literata at 0.875em, line-height 1.55, hanging indent, long URLs wrap anywhere.
- Sidebar (local graph, Linked from, Links to, Last edited) and fact box: system sans at 0.875rem.
- Graph labels: system sans, 12.5px at zoom 1, with a background-colored outline so they stay legible over edges and nodes.

## Verified

Desktop (1280) and phone (390) × light and dark, on a long temporary specimen page (headings, lists, blockquote with ſ/þ/macrons, table, bibliography), since removed. Zero external requests, all fonts from `/fonts/`; `dist/` contains no external font references.
