---
description: End-of-session wrap — session log, STATUS.md, boards, dashboard
---
You are ending a working session. Do the following in order:

1. Summarize this session: what happened, decisions made (with reasoning), artifacts created (with paths), what's still open. Append it as a new entry at the TOP of this project's SESSION_LOG.md (check `docs/SESSION_LOG.md` first, else project root), matching the existing entry format.
2. Rewrite STATUS.md: Now / Next (ranked) / Blockers / Recently done / Open questions. Stamp today's date. Keep it under one page.
3. If the project's phase, next action, or blockers changed: update the client-level STATUS.md one directory up (if this project has one) and this project's row in the nearest PROJECTS.md board (clients or mdggrowth root, if present).
4. **Dashboard:** if the phase, next action, blockers, or any deadline changed, update this project's card (and any deadline entries) in `~/Documents/dev/everyway/dashboard/data.json` — keep each field to one tight line, and set the card's `"updated"` field to today (YYYY-MM-DD) — then run `node ~/Documents/dev/everyway/dashboard/build.mjs`. Never edit the dashboard HTML directly; it is a build output. See `~/Documents/dev/everyway/dashboard/CLAUDE.md` for card conventions.
5. If a `HANDOFF.md` exists at the project root: fold anything still relevant into STATUS.md (Next / Blockers / Open questions), note in the SESSION_LOG entry which handoff items were addressed, then delete HANDOFF.md.
6. If SESSION_LOG.md now exceeds ~50KB, compact per the `~/Documents/dev/_system/PLAYBOOK.md` §8.
7. Reply with the refreshed "Next" list so the user leaves with clear next actions.
