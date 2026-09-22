# STATUS — The Muse · updated 2026-09-22

## Now
Phase 0 done; typography locked. Astro 7 static site builds from `vault/`: wikilinks → `graph.json` → one page per node, canvas d3-force graph (global homepage + local one-hop per page), backlinks, last-edited date (git), validator gating every build. Three seed stubs linked (KJV, James I, Daemonologie). Type spec set by Matt and locked in `docs/TYPOGRAPHY.md` (Literata body, EB Garamond headings, system sans UI, self-hosted subsets, light + dark). Templates live in `vault/templates/`. Public repo: github.com/mattglbrt/themuse (main).

## Next (ranked)
1. ~~Obsidian check + first commit~~ done 09-22 (public repo).
2. Phase 1 research: work `research/QUEUE.md` (bare `/research`). Memos land in `research/`.
3. Write `king-james-bible.md` from the memos (full template, every claim tiered + cited), set `status: researched`. Fill `james-i` / `daemonologie` frontmatter (dates) from memos.
4. Seed stubs for the first-order links (frontmatter + dek from the brief only): `william-tyndale`, `geneva-bible`, `latin-vulgate`, `jerome`, `septuagint`, `erasmus`, `hampton-court-conference`, `english-reformation`.
5. Phase 2: Netlify deploy, brand pass, graph as homepage (already is).

## Research queue
Lives in `research/QUEUE.md` (8 KJV questions queued 09-22; a run started from the old list here is in progress in another session). Bare `/research` works the queue; `/research add <q>` queues one.

## Blockers
- Matt: channel name ("The Muse" as working title?) and domain. Needed by Phase 2, not before.

## Recently done
- 2026-09-22 — Typography locked: Literata + EB Garamond self-hosted subsets, system-sans UI, ~70-char measure, light/dark; verified desktop/phone × light/dark, zero external requests.
- 2026-09-22 — Phase 0: scaffold, pipeline, graph, validator, 3 stubs, brief split. Verified in headless Chrome (graph → click → page → local graph → backlinks).
- 2026-09-22 — researcher agent + /research command + six node templates locked in.
- 2026-09-22 — renderer decision CLOSED by Matt: custom Astro, no community project, no Obsidian hosting.

## Open questions
- Domain? Channel handle availability?
- Is the KJV lecture one episode or an arc? The trail structure supports either.
