# Build brief v1 (2026-09-22), archived

> Moved here from CLAUDE.md at the end of Phase 0 (2026-09-22). Kept verbatim as the record of the resolved decisions. One path change since: the node templates now live in `vault/templates/` (Obsidian only allows a template folder inside the vault), not `templates/`. How the pipeline was actually built: `docs/ARCHITECTURE.md`.

## What this is
A YouTube channel and its companion site. The channel: in-depth lectures on philosophical, occult, and historical topics, framed as **following the Muse as she inspires and teaches** — a history of the human experience told by moving through primary documents. The site: the channel's **reference library and bibliography**, a web of interconnected markdown documents rendered as an **Obsidian-style force-directed graph** — nodes are works, people, artifacts, and topics; edges are where the Muse led. Because the material will border on conspiracy territory, the site is built to survive scholarly scrutiny — see Scholastic rigor. Personal MDG Growth venture; no client, no deadline pressure, credibility is the product.

**Done for v1:** the graph is live on the web with the first document trail (starting at the King James Bible), every claim cited, and the first episode's script can be written entirely from the site's nodes.

## Editorial thesis (why the KJV is node one)
**The KJV is where most Westerners first touch the occult without knowing it — and it is the gateway out into everything else.** It is the most familiar text in the Western canon, and it sits in the middle of everything the channel wants to reach: commissioned by a king who wrote his own witchcraft treatise, translated in the high era of Renaissance Hermeticism and Christian Cabala, built on texts (Septuagint, Vulgate, Apocrypha) whose own histories carry the esoteric threads, and full of material — angelology, demonology, prophecy, the removed books — that the familiar Sunday reading passes over. The channel's move, every episode: **start from what the audience already knows, read it closely and honestly, and let the documented connections lead outward.** Framed under the rigor doctrine, this thesis is unassailable — the esoteric context of the KJV is established history, not speculation — which is exactly what makes it the right gateway.

## The core design decision (RESOLVED 2026-09-22)
**The markdown vault is the asset; the site is a custom build — no community project, no Obsidian hosting.** Matt authors in the free Obsidian desktop app against `vault/` in this repo; git is the sync (never Obsidian Sync/Publish — nothing is paid, nothing is hosted by Obsidian). The site is **built from scratch in Astro** (house lineage: AITD, hobbinomicon, mattglbrt, goeveryway), fully owned:

- **Build pipeline:** at build time, walk `vault/**/*.md` → parse frontmatter + `[[wikilinks]]` (and `![[image]]` embeds) → emit `graph.json` (nodes: slug, title, type, status, tags; edges: source→target) → Astro renders one page per node (remark pipeline with a small wikilink plugin) and the graph views from that JSON.
- **Graph rendering:** custom force-directed graph, d3-force (or a hand-rolled simulation) on canvas/SVG — global graph as the homepage, a local one-hop graph on every node page. Node color by `type`, size by degree, styling fully ours. Click node → page; backlinks section on every page computed from the same JSON.
- **Rules:** the vault stays 100% Obsidian-compatible plain markdown — the site build must never require syntax Obsidian can't render, and Obsidian conventions the build doesn't support yet just render plain (degrade, never break). No CMS, no database, static output to Netlify.

## Node types & schema
Six types, templates in `templates/` (Phase 0 wires them into Obsidian's template folder):

| type | what | template |
|---|---|---|
| `book` | any primary document — scripture, treatise, pamphlet, grimoire (most nodes) | `templates/book.md` |
| `person` | people — authors, translators, kings, occultists | `templates/person.md` |
| `artifact` | physical things — archaeological finds, artworks, monuments, relics, sites | `templates/artifact.md` |
| `topic` | ideas, movements, events — the junction nodes two books connect through | `templates/topic.md` |
| `show-notes` | Matt's episodes — carries the ordered `trail`, claims made, consolidated bibliography | `templates/show-notes.md` |
| `lecture` | recordings of others' lectures — hosted *about*, never endorsed; tiers do the work | `templates/lecture.md` |

Every node: frontmatter per its template · a one-paragraph dek · `## Historical Context` · the content · `## Where the Muse Leads` (outbound wikilinks, each with a one-line why) · `## Bibliography`. `status: seed → researched → scripted → published`. Filenames lowercase-kebab, one concept per file.

**Images:** any node may embed images (`vault/assets/`, Obsidian `![[...]]` embeds — the build resolves them). **Public domain or properly licensed only, credit line required, source + license cited in the node's bibliography.** Museum open-access collections (Met, Rijksmuseum, British Museum where licensed), Wikimedia Commons with license checked. The no-AI-art rule applies here absolutely — every image is a real photograph or scan of a real thing.

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

## Voice & authorship
Research and drafting are assisted; **the published voice is Matt's** — lecture register, plain and direct, no AI-tells (the hobbinomicon voice.md ban list applies: no "delve", near-zero em-dashes, no grand endings). A `voice-muse.md` gets written after the first script, distilled from how the first lecture actually sounds. The "no AI-generated art" footer promise (mattglbrt.com) applies to channel art and thumbnails.

## First trail — the King James Bible (seed plan)
`king-james-bible.md` covers: why it exists (Hampton Court Conference 1604, James I, the Puritan Millenary Petition, the political problem of the Geneva Bible's marginal notes), how it was made (six translation companies at Westminster/Oxford/Cambridge, Bishops' Bible as the base text, the rules of translation), what it descends from (Tyndale — the bulk of its NT phrasing, the Vulgate, Erasmus and the Textus Receptus, the Septuagint), its afterlife (printing errors like the Wicked Bible, the 1769 Oxford standard, its grip on the English language), and what's in it (canon, Apocrypha and its later removal).
First-order links out — each becomes its own node: `william-tyndale` · `geneva-bible` · `latin-vulgate` / `jerome` · `septuagint` · `erasmus` · `james-i` — whose `daemonologie` (1597, the king's own witchcraft treatise) is the natural first turn toward the occult thread · `hampton-court-conference` · `english-reformation`. The Muse decides which door opens next.

## Stack & conventions
- Repo layout: `vault/` (the markdown — the whole asset) · Astro app (src/, the graph build script) · `scripts/` for graph build/validation. Deploy: Netlify, static.
- Node filenames: lowercase-kebab, named for the work/figure/topic. One concept, one file. Stubs are fine — a `status: seed` node with two lines and a reason-it-matters is how the frontier grows.
- A link means something: wikilink only where the connection would be worth saying out loud on the channel. The graph is the argument, not decoration.
- Validation script (Phase 2): broken wikilinks, orphan nodes, missing frontmatter, claims sections without sources — run before deploy.
- GEO from day one once live: llms.txt + markdown endpoints (port the hobbinomicon pattern) — a reference site is exactly what AI search cites.
- All AI on Matt's subscription — never an API key.

## Phases
- **0 — Scaffold.** Astro project + `vault/` + node template + the build pipeline (wikilink parse → graph.json → pages) + a first-pass d3-force graph; this file splits (brief → docs/, CLAUDE.md slims to entrypoint form). *Exit: a three-stub vault renders as a clickable graph locally.*
- **1 — First document, done right.** `king-james-bible.md` fully researched and cited + seed stubs for its first-order links. *Exit: the KJV node could carry a lecture on its own.*
- **2 — Site live.** Deploy, brand pass (dark, illuminated-manuscript-adjacent but its own identity — not Hobbinomicon's parchment), validation script, graph as homepage. *Exit: URL Matt can show someone.*
- **3 — First trail + script.** `show-notes` node type working end-to-end; write episode 1's script from the nodes; `voice-muse.md` distilled from it. *Exit: script Matt would record.*
- **4 — Channel scaffolding.** Channel identity, episode template (description = trail link + bibliography), thumbnail conventions honoring the no-AI-art rule. *Exit: episode 1 publishable.*
- **5 — The loop.** Each episode: research nodes → trail → script → record → publish → backlink episode URL into its nodes. The site grows exactly as fast as the channel walks.

## Research protocol
Research runs through the **researcher agent** (`.claude/agents/researcher.md`, invoked via `/research <question>`). It is open-book only — model memory is banned as a source; every claim returns with a fetched link + verbatim supporting quote + tier + confidence, a mandatory verification pass re-checks every row, and "not found" is a valid answer. Memos land in `research/` and are the raw material nodes get written from. **No fact enters the vault that isn't backed by a research memo or Matt's own verified reading.**

## Doc map
`STATUS.md` (read first) · `SESSION_LOG.md` · `templates/` (the six node templates) · `research/` (verified research memos) · `docs/` (brief lands here at Phase 0)

