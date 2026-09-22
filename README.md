# The Muse

The reference library behind **The Muse**, a YouTube lecture channel on philosophy, the occult and history. Each episode follows the Muse through primary documents: it starts from something familiar, reads it closely, and follows the documented connections outward. The first trail starts at the King James Bible.

This repo is that library. It's a web of linked markdown notes (books, people, artifacts, topics, episodes), written in [Obsidian](https://obsidian.md) and published as a static website with a force-directed graph you can explore. The site is the evidence behind the episodes: every claim is tiered and cited, so an academic could land on any page and find the sourcing sound, whatever they think of the topic.

Everything here is MIT-licensed. Clone it, fork it, reuse it. See [License](#license).

---

## Contents

- [Quick start](#quick-start)
- [Using the site](#using-the-site)
- [Writing in the vault (Obsidian)](#writing-in-the-vault-obsidian)
- [How it works](#how-it-works)
- [Research agents](#research-agents)
- [The rigor rules](#the-rigor-rules)
- [Project layout](#project-layout)
- [License](#license)

---

## Quick start

You need [Node.js](https://nodejs.org) (built and tested on Node 24) and git.

```sh
git clone https://github.com/mattglbrt/themuse.git
cd themuse
npm install
npm run dev
```

`npm run dev` prints the local URL, usually `http://localhost:4321`, or the next free port if that one's taken. Open it and you're looking at the graph.

| Command | What it does |
|---|---|
| `npm run dev` | Local site with live reload. Edit a note in `vault/` and the browser refreshes. |
| `npm run validate` | Checks the vault for broken links, orphan notes, bad frontmatter and misnamed files. |
| `npm run build` | Validates, then builds the static site into `dist/`. Any vault problem stops the build. |
| `npm run preview` | Serves the built `dist/` locally. |

Astro 7 runs the dev server in the background. `npx astro dev status` shows whether it's running, and `npx astro dev stop` stops it.

## Using the site

**The homepage is the whole graph.** Every dot is a note, and every line is a link between two notes.

- **Color** is the note's type: book, person, artifact, topic, show notes or lecture. The legend is in the corner.
- **Size** is how connected it is. Bigger dots have more links.
- **Hover** a dot to highlight its neighbors.
- **Click** a dot to open that note's page.
- **Drag** a dot to move it, **drag the background** to pan, and **scroll** to zoom.

**Each note page** has the note itself on the left and a sidebar on the right:

- **Local graph:** just this note and everything one link away. The current note has a ring around it. Click any dot to move to that note.
- **Linked from:** every note that links here (backlinks).
- **Links to:** every note this one links out to.
- **Last edited:** the date of the last commit that touched the note.

A page marked **seed** is a placeholder: it names a subject worth covering, but it hasn't been researched yet. The site says so at the top of the page, and nothing on it is a sourced claim.

The site follows your system's light or dark setting.

## Writing in the vault (Obsidian)

`vault/` is a normal Obsidian vault. In Obsidian choose **Open folder as vault** and pick the `vault/` folder, not the repo root. The shared settings come with it: templates, wikilinks, attachments going to `assets/`, and graph colors that match the site.

Obsidian is only the editor. Nothing is hosted by Obsidian and no paid features are used. Git is the sync.

### Making a note

1. Create a new note. Name the file in lowercase-kebab after its subject, like `william-tyndale.md`. One subject per file.
2. Run **Templates: Insert template** and pick the type:

| Type | For |
|---|---|
| `book` | Any primary document: scripture, treatise, pamphlet, grimoire. Most notes. |
| `person` | Authors, translators, kings, occultists. |
| `artifact` | Physical things: finds, artworks, monuments, relics, sites. |
| `topic` | Ideas, movements, events: the junctions two documents connect through. |
| `show-notes` | An episode: its ordered trail of notes, the claims it makes, and its full bibliography. |
| `lecture` | Someone else's recorded lecture, hosted *about*, never endorsed. |

3. Fill in the frontmatter (`title`, `type` and `status` are required) and write the sections the template gives you: a one-paragraph dek, historical context, the content, **Where the Muse Leads** (outbound links, one line each on why), and a bibliography.

`status` moves `seed` → `researched` → `scripted` → `published`. A two-line seed note is fine. That's how the edge of the map grows.

### Links

- `[[william-tyndale]]` links to a note by filename. `[[william-tyndale|Tyndale]]` changes the link text, and `[[william-tyndale#Life & Work]]` jumps to a heading.
- Links in frontmatter count too. `author: "[[james-i]]"` draws a line in the graph, the same as in Obsidian.
- **A link should mean something.** Link only where the connection would be worth saying out loud in an episode. The graph is the argument, not decoration.
- A link to a note that doesn't exist yet shows on the site as a dotted red span, and `npm run validate` flags it.

### Images

Put images in `vault/assets/` and embed them with `![[file.jpg]]`, or `![[file.jpg|400]]` to set a width. They must be public domain or properly licensed, with the source and license cited in the note's bibliography. Every image is a real photograph or scan of a real thing. No AI-generated art, ever.

### Before you commit

Run `npm run validate`. It fails on:

- broken wikilinks or image embeds
- notes with no links in or out (orphans)
- missing or invalid `title` / `type` / `status`
- filenames that aren't lowercase-kebab
- slugs that collide with site routes

The build runs the same check, so a broken vault never deploys.

## How it works

It's a small custom [Astro](https://astro.build) site. There's no CMS, no database and no graph library beyond [d3-force](https://d3js.org/d3-force) for the physics.

```
vault/**/*.md ──► src/lib/vault.mjs ──► graph (nodes + edges)
                                          ├─► /graph.json         the data the graph views draw
                                          ├─► /<note-name>/       one static page per note
                                          └─► scripts/validate.mjs runs before every build
vault/assets/* ──────────────────────────────► /assets/<file>
```

1. **Read the vault.** `src/lib/vault.mjs` walks `vault/`, skipping `templates/`. It parses each note's YAML frontmatter and pulls out every `[[wikilink]]` and `![[embed]]`, from both the body and the frontmatter. Links resolve by filename the way Obsidian does.
2. **Build the graph.** Notes become nodes (slug, title, type, status, tags) and links become edges (source → target). This is published as `/graph.json`.
3. **Render pages.** `src/lib/render.mjs` turns each note into HTML with a small custom remark plugin that converts wikilinks into site links and embeds into images. Obsidian syntax the site doesn't handle yet falls back to plain text rather than breaking.
4. **Draw the graph.** `src/scripts/graph.js` fetches `graph.json` and draws it on a canvas: the whole graph on the homepage, and a one-link neighborhood on each note page.

The vault always stays plain Obsidian markdown. The site never needs syntax Obsidian can't show.

More detail: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md). The type spec (Literata for reading, EB Garamond for headings, self-hosted, about 70 characters per line) is in [`docs/TYPOGRAPHY.md`](docs/TYPOGRAPHY.md).

## Research agents

No fact goes into the vault without a research memo behind it, or a reading of the source by Matt himself. The research is done by an AI agent built to find and verify sources, not to remember facts.

It runs inside [Claude Code](https://claude.com/claude-code): the agent is defined in `.claude/agents/researcher.md` and the command in `.claude/commands/research.md`. Open Claude Code in this repo and the `/research` command is available. It runs on a Claude subscription, and no API key is involved.

### The commands

| Command | What happens |
|---|---|
| `/research <question>` | Researches that one question now. |
| `/research add <question>` | Adds the question to the queue without running it. |
| `/research` | Works through the queue top to bottom, up to four questions at a time, and ticks each one off as its memo lands. |

### The queue

[`research/QUEUE.md`](research/QUEUE.md) is a plain checklist you can edit in any text editor:

```markdown
## Queue
- [ ] A question to look into — optional note on why, or which note it feeds

## Parked
- [ ] Something to skip for now

## Done
- [x] A finished question → [memo](2026-09-22-some-slug.md) · 2026-09-22
```

Order is priority: the top runs first. Move a line under **Parked** to skip it for now. Before running anything, `/research` checks `research/` for an existing memo that already answers the question, so nothing gets researched twice.

### What the researcher does

The agent works **open-book only**. Its own memory never counts as a source. It can use what it knows to decide where to look, but every claim it returns has to trace to a page it actually fetched in that session.

Each run writes a memo to `research/YYYY-MM-DD-<slug>.md` with a claims table:

| Claim | Tier | Source | Link | Supporting quote (verbatim) | Confidence |
|---|---|---|---|---|---|

- **Tier:** Established, Contested, Tradition or Speculation (see [the rigor rules](#the-rigor-rules)).
- **Supporting quote:** the exact words from the fetched page, never a paraphrase.
- **Confidence:** `verified`, `single-source` (only one independent source found) or `needs-print-check` (the book exists, but the claim still has to be checked in a print copy).

Before returning, the agent **re-checks every row**: the link resolves, it's the document claimed, and the quote appears word for word. Wikipedia and encyclopedias count only as maps to the real sources, never as sources themselves.

**"Not found" is a valid answer.** Dead ends are reported alongside the findings, because knowing what couldn't be sourced matters as much as what could.

Research never edits the vault. Turning a memo into a note is a separate, deliberate step, and the note cites the sources from the memo.

## The rigor rules

The subjects here sometimes border on conspiracy territory. That's exactly why every page has to stand up to scholarly scrutiny. Every claim is one of four tiers, and contested ones say so on the page:

1. **Established:** scholarly consensus, cited to academic sources. Stated as fact.
2. **Contested:** genuine scholarly disagreement. Both positions, both cited.
3. **Tradition:** what an esoteric, occult or religious tradition holds, presented *as tradition* and attributed to which tradition and when. Never quietly promoted to history.
4. **Speculation:** the conspiracy-adjacent material. State the claim fairly, name who makes it and since when, and lay out what the documented record shows. The site documents the claim as a claim. The history of an idea is real history.

Also:
- Quotes are exact, from a named edition, or clearly marked as paraphrase.
- "Unknown" and "disputed" are valid answers.
- Popular myths get addressed and labeled, not repeated or ignored.

## Project layout

```
vault/                 the Obsidian vault: the actual content
  templates/           the six note templates (Obsidian's template folder)
  assets/              images embedded in notes
  .obsidian/           shared Obsidian settings (personal ones are gitignored)
research/              verified research memos + QUEUE.md
src/
  lib/vault.mjs        reads the vault into a graph
  lib/render.mjs       markdown + wikilinks → HTML
  lib/types.mjs        the note types, their colors, and the statuses
  pages/               homepage, one page per note, graph.json, assets
  scripts/graph.js     the canvas graph
  styles/              fonts and site styles
scripts/validate.mjs   the vault checker
public/fonts/          self-hosted font files (OFL)
docs/                  brief, architecture, typography spec
.claude/               the research agent and project commands for Claude Code
```

## License

[MIT](LICENSE). That covers the code, the docs and the vault notes. It doesn't cover the fonts (SIL Open Font License), images in `vault/assets/` (each under its own cited license), or quoted passages from other works. [`NOTICE.md`](NOTICE.md) has the details.
