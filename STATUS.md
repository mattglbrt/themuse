# STATUS — Following the Muse · updated 2026-09-22

## Now
Phase 0 done, Phase 1 research running. Astro 7 static site builds from `vault/` (graph homepage, local graph + backlinks + last-edited per page, validator gating builds); three seed stubs; typography locked (`docs/TYPOGRAPHY.md`). Repo is **public + MIT**: github.com/mattglbrt/themuse, README covers use, authoring, pipeline and research. Research queue live in `research/QUEUE.md`; a run in another session is working the 8 KJV questions (memos landing, not yet committed).

## Next (ranked)
1. Let the research run finish, then bare `/research` to tick any stragglers; review memos (single-source / needs-print-check / dead ends first, and the Hermeticism memo against the editorial thesis); commit the memos + `QUEUE.md`.
2. Write `king-james-bible.md` from the memos (full template, every claim tiered + cited), set `status: researched`. Fill `james-i` / `daemonologie` from their memos.
3. Seed stubs for the first-order links (frontmatter + dek from the brief only): `william-tyndale`, `geneva-bible`, `latin-vulgate`, `jerome`, `septuagint`, `erasmus`, `hampton-court-conference`, `english-reformation`.
4. Phase 2: Netlify deploy, brand pass (colors; type is locked), domain.

## Research queue
Lives in `research/QUEUE.md`. `/research add <q>` queues one; bare `/research` works the queue top to bottom and ticks items off with their memo.

## Blockers
- Matt: domain. Needed by Phase 2, not before.

## Recently done
- 2026-09-22 — Name decided by Matt: **Following the Muse** (channel and site). Site header, tab titles and README updated; repo and folder stay `themuse`.
- 2026-09-22 — Public repo (github.com/mattglbrt/themuse) + MIT license + NOTICE.md; research queue + `/research add`; README.
- 2026-09-22 — Obsidian check passed (Matt); per-device Obsidian files gitignored.
- 2026-09-22 — Typography locked: Literata + EB Garamond self-hosted subsets, system-sans UI, ~70-char measure, light/dark; verified desktop/phone × light/dark, zero external requests.
- 2026-09-22 — Phase 0: scaffold, pipeline, graph, validator, 3 stubs, brief split. Verified in headless Chrome (graph → click → page → local graph → backlinks).
- 2026-09-22 — researcher agent + /research command + six node templates locked in.
- 2026-09-22 — renderer decision CLOSED by Matt: custom Astro, no community project, no Obsidian hosting.

## Open questions
- Move the research queue into the vault so it's editable from Obsidian (kept off the site)?
- Domain? Channel handle availability?
- Is the KJV lecture one episode or an arc? The trail structure supports either.
