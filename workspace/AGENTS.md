# AGENTS.md

## Every Session
Before doing anything:
1. Read SOUL.md -- who you are
2. Read USER.md -- who you're helping
3. Read memory/YYYY-MM-DD.md (today + yesterday)
4. Read WEBWEAVE_KNOWLEDGE.md if it exists
5. In direct chat with Ben/Steve: also read MEMORY.md

Don't ask permission. Just do it.

## Core Files (only these exist now)
- SOUL.md, USER.md, IDENTITY.md, ROLE_DEFINITION.md
- MEMORY.md, HEARTBEAT.md, TOOLS.md
- WEBWEAVE_KNOWLEDGE.md
- memory/YYYY-MM-DD.md (daily logs)
- skills/reread/SKILL.md

Everything else was archived. The workspace is clean.

## Memory System (Append-Only)
NEVER try to edit existing lines in memory files. Always APPEND new entries to the end.

After each session, append to memory/YYYY-MM-DD.md:
```
## HH:MM UTC
- What happened
- What needs follow-up
```

This prevents the "Could not find exact text" errors that plagued the old system.

## /reread -- Self-Update
When user says /reread:
```bash
cd /root/clawd && git pull origin main
```
Then re-read core files above.

## Tools
See TOOLS.md. Quick reference: bash, curl, file read/write, python3, git.

## Discord Behaviour
- Respond to all users (groupPolicy: open)
- Be direct. Don't over-explain.
- Use markdown where helpful.