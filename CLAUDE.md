# CLAUDE.md — The Muse

## What this is
A YouTube lecture channel (philosophy, occult, history), framed as following the Muse as she inspires and teaches, plus its companion site: the channel's reference library and bibliography, a web of wikilinked markdown documents rendered as a force-directed graph. Personal MDG Growth venture; no client, no deadline pressure, credibility is the product.
**Done for v1:** the graph is live on the web with the first document trail (starting at the King James Bible), every claim cited, and the first episode's script can be written entirely from the site's nodes. Full brief v1 with the resolved decisions and phases: `docs/BRIEF.md`.

## Editorial thesis (why the KJV is node one)
**The KJV is where most Westerners first touch the occult without knowing it — and it is the gateway out into everything else.** It is the most familiar text in the Western canon, and it sits in the middle of everything the channel wants to reach: commissioned by a king who wrote his own witchcraft treatise, translated in the high era of Renaissance Hermeticism and Christian Cabala, built on texts (Septuagint, Vulgate, Apocrypha) whose own histories carry the esoteric threads, and full of material — angelology, demonology, prophecy, the removed books — that the familiar Sunday reading passes over. The channel's move, every episode: **start from what the audience already knows, read it closely and honestly, and let the documented connections lead outward.** Framed under the rigor doctrine, this thesis is unassailable — the esoteric context of the KJV is established history, not speculation — which is exactly what makes it the right gateway.

## Scholastic rigor (the moat — non-negotiable)
The topics will border on "truther" / conspiracy territory. **That is exactly why every page must stand up to scholastic scrutiny** — the channel gets to walk strange paths because the site always has the receipts. An academic should be able to land on any node and find nothing to object to in its sourcing, whatever they think of the topic.

**Every node carries three required sections:** `## Historical context` (when, where, why — the world around the document), the content itself, and `## Bibliography` (full citations: edition, year, page/section where quoted; link free editions — Project Gutenberg, archive.org, sacred-texts).

**Four-tier claim taxonomy — every claim is one of these, and contested ones say so inline:**
1. **Established** — scholarly consensus, cited to academic sources. Stated as fact.
2. **Contested** — genuine scholarly disagreement. Both positions, both cited.
3. **Tradition** — what esoteric/occult/religious tradition holds. Presented *as tradition*, attributed to which tradition and when ("Hermetic tradition holds…", "19th-century occultists read this as…"). Never silently promoted to history.
4. **Speculation** — the conspiracy-adjacent material. **Steelman it, then source it:** state the claim fairly, name who makes it and since when, lay out what evidence exists and what the documented record shows. The site never asserts speculation as fact; it documents the claim *as a claim* — which is itself real history (the history of an idea is a legitimate topic and often the best episode material).

Plus: never invent or approximate quotes (exact words from a named edition, or paraphrase and say so); "Unknown"/"disputed" are valid values; popular myths (Shakespeare in Psalm 46, Bacon editing the KJV) get addressed and labeled, not repeated or ignored; copyrighted works get short quotes + citation only.

**Show notes live here.** Every `show-notes` node is its extensive show notes: the ordered nodes, what the episode claims, per-claim tier where it matters, and the full consolidated bibliography for the episode. Video descriptions link the trail page — the site is the channel's evidentiary spine, not a companion.

## Stack & environment
- **Vault is the asset.** `vault/` is plain Obsidian markdown, authored in the free Obsidian app. Git is the sync. Never Obsidian Sync/Publish.
- **Site:** custom Astro 7 (static), d3-force on canvas. No content collections, no CMS, no database. How it fits together: `docs/ARCHITECTURE.md`.
- Deploy: Netlify, static (Phase 2). Domain TBD.
- Node 24. Dev server: `npm run dev` (Astro 7 runs it detached; the URL is in the output, default port 4321 or the next free one).

## Key commands
- `npm run dev`: local site; vault edits reload the browser.
- `npm run validate`: vault check (broken links, orphans, frontmatter, filenames, embeds).
- `npm run build`: validate, then build to `dist/`. Any vault problem fails the build.
- `/research <question>`: researcher agent → verified memo in `research/`. The only way facts enter the vault.
- `/research add <question>` queues one in `research/QUEUE.md`; bare `/research` works the queue top to bottom and ticks items off with their memo.
- `/orient` · `/wrap`: session ritual.

## Conventions
- **Six node types**, templates in `vault/templates/` (Obsidian's template folder): `book` · `person` · `artifact` · `topic` · `show-notes` · `lecture`. Every node has a dek, `## Historical Context`, the content, `## Where the Muse Leads` (outbound links, one line of why each), `## Bibliography`. `status: seed → researched → scripted → published`.
- Filenames lowercase-kebab, named for the work/figure/topic. One concept per file. A seed stub with two lines and a reason it matters is fine.
- A link means something: wikilink only where the connection would be worth saying out loud on the channel. The graph is the argument.
- Keep the vault 100% Obsidian-compatible. The build must never need syntax Obsidian can't render; unsupported Obsidian syntax degrades to plain, never breaks.
- **Images:** `vault/assets/` via `![[...]]` embeds. Public domain or properly licensed only, credit line required, source + license in the node's bibliography. Every image is a real photograph or scan of a real thing. No AI art, ever (thumbnails and channel art included).
- **Typography is locked:** `docs/TYPOGRAPHY.md` (Literata body, EB Garamond headings, system sans for interface, self-hosted subsets, ~70-character measure). Don't relitigate.
- **Voice:** research and drafting are assisted; the published voice is Matt's. Lecture register, plain and direct, no AI-tells (hobbinomicon `voice.md` ban list). `voice-muse.md` gets written after the first script.
- **Research protocol:** no fact enters the vault without a `research/` memo (fetched link + verbatim quote + tier + confidence, verification pass done) or Matt's own verified reading.
- **Open by design:** the repo is public and MIT-licensed (`LICENSE`), vault content included. Never commit anything private. Fonts (OFL), images in `vault/assets/` and quoted works keep their own licenses; `NOTICE.md` spells out the exceptions.
- GEO once live: llms.txt + markdown endpoints (hobbinomicon pattern).
- All AI on Matt's subscription. Never an API key.

## Doc map
- `STATUS.md`: where we are now (read first)
- `SESSION_LOG.md`: history, newest first
- `docs/BRIEF.md`: build brief v1, verbatim (design decision, schema, KJV seed plan, phases)
- `docs/ARCHITECTURE.md`: the vault → graph.json → pages pipeline as built
- `docs/TYPOGRAPHY.md`: the locked reading/type spec
- `vault/templates/`: the six node templates
- `research/`: verified research memos · `research/QUEUE.md`: the research queue
- `.claude/agents/researcher.md`: the research agent's rules

---

## Session workflow (Everyway standard)
Start: `/orient` — read `STATUS.md`. End: `/wrap` — SESSION_LOG entry, refresh STATUS.md, update `../PROJECTS.md` row + the dashboard card if the picture changed. Playbook: `~/Documents/dev/_system/PLAYBOOK.md`.
