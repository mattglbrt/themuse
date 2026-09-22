---
description: Verified research on a topic — /research <question or topic>
---
Run the research protocol on the question in the argument.

1. Spawn the **researcher** agent (`.claude/agents/researcher.md`) with the question. For a broad topic, break it into 2-4 focused sub-questions and spawn the researcher for each — parallel where independent.
2. The researcher writes its memo(s) to `research/YYYY-MM-DD-<slug>.md` with a verified claims table (every claim: tier, real fetched source, link, verbatim quote, confidence) and a verification statement.
3. Compile: read the memo(s), report back the headline findings, anything marked single-source / needs-print-check / failed verification, and the dead ends — Matt needs to see what could NOT be sourced as clearly as what could.
4. Suggest which nodes this research feeds (existing or new) — but do not create or edit vault pages; that is a separate, deliberate step.

Never let findings into the summary that are not in a memo's verified table. If the researcher returns anything without a link + verbatim quote, send it back rather than passing it through.
