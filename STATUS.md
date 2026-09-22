# STATUS — The Muse · updated 2026-09-22

## Now
Phase 0 done; typography locked. Astro 7 static site builds from `vault/`: wikilinks → `graph.json` → one page per node, canvas d3-force graph (global homepage + local one-hop per page), backlinks, last-edited date (git), validator gating every build. Three seed stubs linked (KJV, James I, Daemonologie). Type spec set by Matt and locked in `docs/TYPOGRAPHY.md` (Literata body, EB Garamond headings, system sans UI, self-hosted subsets, light + dark). Templates live in `vault/templates/`. Public repo: github.com/mattglbrt/themuse (main).

## Next (ranked)
1. ~~Obsidian check + first commit~~ done 09-22 (public repo).
2. Phase 1 research: run the `/research` questions below, parallel where independent. Memos land in `research/`.
3. Write `king-james-bible.md` from the memos (full template, every claim tiered + cited), set `status: researched`. Fill `james-i` / `daemonologie` frontmatter (dates) from memos.
4. Seed stubs for the first-order links (frontmatter + dek from the brief only): `william-tyndale`, `geneva-bible`, `latin-vulgate`, `jerome`, `septuagint`, `erasmus`, `hampton-court-conference`, `english-reformation`.
5. Phase 2: Netlify deploy, brand pass, graph as homepage (already is).

## Phase 1 /research questions (KJV node)
1. Hampton Court Conference 1604: the Millenary Petition, who proposed a new translation and how James I responded, and why the Geneva Bible's marginal notes were a political problem for him.
2. How the KJV was made: the six companies (where, who led them), Bancroft's rules for the translators, the Bishops' Bible as the base text, and the 1611 first printing.
3. What it descends from: Tyndale's share of the KJV's New Testament wording (the percentage figures in circulation and who measured them; likely Contested), Erasmus and the Textus Receptus, and what role the Vulgate and Septuagint actually played.
4. Its afterlife: the 1611 "He"/"She" printings, the Wicked Bible (1631), the 1769 Oxford (Blayney) standard text, and documented influence on English.
5. The Apocrypha: its place in the 1611 edition, and when and why it was dropped from printings (who decided, what year).
6. Myths to label: Shakespeare in Psalm 46, Francis Bacon as editor, and whether the KJV was ever formally "authorized."
7. The thesis claim itself: sourcing that 1604–1611 England was an era of Renaissance Hermeticism and Christian Cabala. The editorial thesis calls this established history, so it needs backing before a script leans on it.
8. (Next door) *Daemonologie*: publication date and place, and its documented link to the North Berwick witch trials.

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
