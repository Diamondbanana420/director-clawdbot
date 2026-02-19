---
name: reread
description: Re-read all workspace files, pull latest changes from GitHub, and self-update. Use this to refresh your knowledge of your own config, instructions, and scripts.
user-invocable: true
---

# /reread — Refresh Workspace & Self-Update

When the user runs `/reread`, perform ALL of the following steps in order:

## Step 1: Pull Latest Changes from GitHub

```bash
cd /root/clawd && git pull origin main 2>&1 || echo "git pull skipped (not a git repo or no remote)"
```

This ensures any changes pushed to the GitHub repo (new scripts, config updates, instruction changes) are pulled into the running container.

## Step 2: Re-read All Core Workspace Files

Read each of these files and internalize their contents:

1. **AGENTS.md** — Your operating instructions, session protocol, memory rules
2. **SOUL.md** — Your personality and behavioral directives  
3. **TOOLS.md** — Your local environment setup and tool usage notes
4. **USER.md** — Information about your authorized controllers
5. **MEMORY.md** — Your long-term curated memory (if in main/DM session)
6. **HEARTBEAT.md** — Your heartbeat task checklist (if it exists)

```bash
echo "=== AGENTS.md ===" && cat /root/clawd/AGENTS.md
echo "=== SOUL.md ===" && cat /root/clawd/SOUL.md
echo "=== TOOLS.md ===" && cat /root/clawd/TOOLS.md
echo "=== USER.md ===" && cat /root/clawd/USER.md
echo "=== MEMORY.md ===" && cat /root/clawd/MEMORY.md 2>/dev/null || echo "(no MEMORY.md)"
echo "=== HEARTBEAT.md ===" && cat /root/clawd/HEARTBEAT.md 2>/dev/null || echo "(no HEARTBEAT.md)"
```

## Step 3: Check Config & Infrastructure Files

Review the live config and Dockerfile for any issues:

```bash
echo "=== clawdbot.json (live) ===" && cat /root/.clawdbot/clawdbot.json
echo "=== Dockerfile ===" && cat /root/clawd/Dockerfile 2>/dev/null || echo "(Dockerfile not in workspace)"
echo "=== entrypoint.sh ===" && cat /root/entrypoint.sh 2>/dev/null || echo "(no entrypoint.sh)"
```

## Step 4: Check for Problems & Self-Fix

After reading everything, check for and report:
- Any files that failed to read (missing/corrupted)
- Config mismatches between template and live config
- Memory files that need cleanup
- Any TODO items or issues mentioned in your files
- Whether the git pull brought in new changes

If you find fixable issues (like missing memory directories, stale files, etc.), fix them immediately.

## Step 5: Report Summary

Reply with a brief summary:
- What files you re-read
- Whether git pull brought new changes
- Any issues found and fixed
- Any issues that need human attention
- Confirm you're up to date and ready

Keep the summary to 3-5 sentences max.
