---
description: Verified research — /research <question> runs one now · /research add <question> queues it · /research (bare) works the queue
---
The research queue lives in `research/QUEUE.md` (sections: **Queue**, **Parked**, **Done**; items are `- [ ]` checklist lines, optionally followed by ` — note`). Pick the mode from the argument:

**`/research add <question>`** — append `- [ ] <question>` as the last item under **## Queue** in `research/QUEUE.md`. Don't run it. Reply with the queue's unchecked items so Matt sees where it landed. Done.

**`/research <question>`** — run the protocol below on that one question now. If the same question is already in the queue, tick it off when its memo lands (see Ticking).

**`/research`** (no argument) — work the queue:
- Take the unchecked `- [ ]` items under **## Queue**, top to bottom. Ignore **Parked** and **Done**. If the queue is empty, say so and stop.
- **Dedupe first:** for each item, check `research/` for a memo that already answers it (a run from another session may have finished it). If one exists, tick the item with that memo instead of re-running.
- Run independent items in parallel, at most 4 researcher agents at a time; the rest wait for the next batch.
- Tick each item as its memo lands, not all at the end, so an interrupted run leaves an accurate queue.

**Ticking** — change the line to `- [x] <question> → [memo](YYYY-MM-DD-<slug>.md) · YYYY-MM-DD` (keep any ` — note`), and move it under **## Done**. A memo that is mostly "not found" still counts as done: the dead ends are the finding. If a run fails before producing a memo, leave the item unchecked and append ` — (attempted YYYY-MM-DD: <one-line reason>)`.

## The protocol (every run)

1. Spawn the **researcher** agent (`.claude/agents/researcher.md`) with the question. For a broad topic, break it into 2-4 focused sub-questions and spawn the researcher for each, in parallel where independent.
2. The researcher writes its memo(s) to `research/YYYY-MM-DD-<slug>.md` with a verified claims table (every claim: tier, real fetched source, link, verbatim quote, confidence) and a verification statement.
3. Compile: read the memo(s), report back the headline findings, anything marked single-source / needs-print-check / failed verification, and the dead ends. Matt needs to see what could NOT be sourced as clearly as what could.
4. Suggest which nodes this research feeds (existing or new), but do not create or edit vault pages; that is a separate, deliberate step. If the research turns up a follow-up question worth chasing, suggest it as a `/research add` line; don't queue it yourself.

Never let findings into the summary that are not in a memo's verified table. If the researcher returns anything without a link + verbatim quote, send it back rather than passing it through.
