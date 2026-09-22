# Architecture: vault → graph → site

As built in Phase 0 (2026-09-22). Fully custom Astro; no content collections, no community graph project.

## Flow

```
vault/**/*.md ──► src/lib/vault.mjs ──► graph (nodes + edges + broken links + problems)
                    │                      ├─► /graph.json            (src/pages/graph.json.js)
                    │                      ├─► /<slug>/ per node      (src/pages/[slug].astro)
                    │                      └─► scripts/validate.mjs   (runs before every build)
vault/assets/* ─────┴────────────────────────► /assets/<file>         (src/pages/assets/[...file].js)
```

## Pieces

| File | Job |
|---|---|
| `src/lib/vault.mjs` | Walks `vault/` (skips `templates/` and dot-folders), parses YAML frontmatter, extracts `[[wikilinks]]` / `![[embeds]]` from the body **and** from frontmatter values (`author: "[[james-i]]"` is an edge, same as Obsidian). Ignores links inside code. Resolves by filename, case-insensitive, anywhere in the vault (Obsidian's "shortest path" behavior). Plain Node, so the validator imports it too. |
| `src/lib/render.mjs` | unified pipeline: remark-parse → remark-gfm → **remarkWikilinks** (ours) → rehype. Handles `[[x]]`, `[[x\|alias]]`, `[[x#Heading]]`, `![[img.png]]`, `![[img.png\|300]]`. Unresolved links render as a dotted "broken" span, not an error page. Headings get ids so `#heading` links land. |
| Last edited (sidebar) | `vault.mjs` takes each file's last commit date from `git log`, falling back to file mtime for uncommitted files. Git, not mtime, because a Netlify clone stamps every file with the clone time. If Netlify ever uses a shallow clone, dates would collapse to the latest commit; check on first deploy. |
| Fonts | Locked reading spec: `docs/TYPOGRAPHY.md`. Literata (body) + EB Garamond (headings), self-hosted WOFF2 subsets in `public/fonts/`, `@font-face` in `src/styles/fonts.css`; system sans for all interface and graph labels. |
| `src/lib/types.mjs` | The six node types (label + color) and the four statuses. One source for the validator, pages, legend, and client graph. |
| `src/pages/graph.json.js` | Emits `graph.json`: `nodes[{slug,title,type,status,tags}]`, `edges[{source,target}]`. Edges are directed and deduped; self-links dropped. |
| `src/pages/[slug].astro` | One page per node: type/status kicker, seed notice, frontmatter fact box (empty template fields hidden), rendered body, local graph, "Linked from" (backlinks), "Links to". |
| `src/components/Graph.astro` + `src/scripts/graph.js` | Canvas + d3-force. Global graph (homepage) or one-hop local graph (`focus=slug`, focus node pinned at center with a ring). Color by type, radius by degree. Hover highlights neighbors; drag nodes; drag background to pan; wheel zooms; click navigates. Honors `prefers-reduced-motion` (settles without animating). A hidden link list is the no-JS / screen-reader fallback. |
| `scripts/validate.mjs` | Fails the build on: missing/invalid `title`/`type`/`status`, non-list `tags`, non-kebab filenames, reserved or duplicate slugs, broken wikilinks, broken embeds, embeds outside `vault/assets/`, orphan nodes. |

## Obsidian side

`vault/` is the Obsidian vault. Shared config is committed in `vault/.obsidian/`: template folder = `templates`, attachments → `assets`, wikilinks (not markdown links), shortest-path link format, auto-update links on rename, `templates/` excluded from search/graph, and graph color groups by `[type:…]` matching the site colors. Per-device state (`workspace.json`, cache) is gitignored.

## Adding things later

- New node type: add it to `src/lib/types.mjs` and a template in `vault/templates/`. Nothing else.
- Obsidian syntax the build doesn't support yet (callouts, block refs, note transclusion) renders as plain text or a plain link. Degrade, never break.
- Reserved slugs (`index`, `assets`, `graph`, `404`) can't be node filenames; the validator catches it.
