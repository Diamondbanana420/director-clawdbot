#!/bin/sh

# Inject Discord token into config
sed "s|__DISCORD_BOT_TOKEN__|${DISCORD_BOT_TOKEN}|g" \
  /root/.clawdbot/clawdbot.json.template > /root/.clawdbot/clawdbot.json

# --- Fix: Write auth-profiles.json for DeepSeek provider ---
# clawdbot looks for API keys in auth-profiles.json inside the agent dir.
# The apiKey in clawdbot.json is NOT sufficient - this file must also exist.
echo "[setup] Writing DeepSeek auth-profiles.json..."
AGENT_DIR="/data/.clawdbot/agents/main/agent"
mkdir -p "$AGENT_DIR"
printf '{\n  "deepseek": {\n    "apiKey": "%s"\n  }\n}\n' "${DEEPSEEK_API_KEY}" > "$AGENT_DIR/auth-profiles.json"
echo "[setup] auth-profiles.json written to $AGENT_DIR"

# --- Git Setup for /reread self-update ---
echo "[setup] Setting up git for self-update capability..."
cd /root/clawd
if [ ! -d ".git" ]; then
  git init
  git remote add origin https://github.com/Diamondbanana420/director-clawdbot.git
  git fetch origin main --depth=1
  git checkout -f origin/main -- workspace/
  cp -r workspace/* . 2>/dev/null || true
  cp -r workspace/.* . 2>/dev/null || true
  echo "[setup] Git repo initialized - /reread will pull latest changes"
else
  echo "[setup] Git repo already initialized"
fi
git config --global user.email "bot@xeriaco.com"
git config --global user.name "XeriaCo Manager"
git config --global --add safe.directory /root/clawd

# --- WebWeave Database Knowledge Sync Function ---
# Fetches the entire WebWeave DB via API and writes to WEBWEAVE_KNOWLEDGE.md
# The agent reads this file as authoritative context for business-related queries.
sync_webweave() {
  echo "[webweave] Starting WebWeave database sync..."
  if [ -z "${WEBWEAVE_API_URL}" ]; then
    echo "[webweave] WEBWEAVE_API_URL not set - skipping sync"
    return 0
  fi

  KNOWLEDGE_FILE="/root/clawd/WEBWEAVE_KNOWLEDGE.md"
  TIMESTAMP="$(date -u '+%Y-%m-%d %H:%M UTC')"

  if [ -n "${WEBWEAVE_API_KEY}" ]; then
    RESPONSE="$(curl -sf --max-time 30 \
      -H "Authorization: Bearer ${WEBWEAVE_API_KEY}" \
      -H "Content-Type: application/json" \
      "${WEBWEAVE_API_URL}" 2>/dev/null)"
  else
    RESPONSE="$(curl -sf --max-time 30 \
      -H "Content-Type: application/json" \
      "${WEBWEAVE_API_URL}" 2>/dev/null)"
  fi

  if [ $? -eq 0 ] && [ -n "$RESPONSE" ]; then
    printf '# WebWeave Knowledge Base\n' > "$KNOWLEDGE_FILE"
    printf '*Last synced: %s*\n\n' "$TIMESTAMP" >> "$KNOWLEDGE_FILE"
    printf 'Use this as authoritative context for: openclaw bots, VPS, business,\n' >> "$KNOWLEDGE_FILE"
    printf 'marketing, Xeriaco, n8n, dropshipping, making money online.\n\n' >> "$KNOWLEDGE_FILE"
    printf '---\n\n' >> "$KNOWLEDGE_FILE"
    printf '%s\n' "$RESPONSE" >> "$KNOWLEDGE_FILE"
    printf '\n---\n*Auto-synced daily. Do not edit manually.*\n' >> "$KNOWLEDGE_FILE"
    echo "[webweave] Synced ($(echo "$RESPONSE" | wc -c) bytes) -> $KNOWLEDGE_FILE"
  else
    echo "[webweave] WARNING: Could not fetch WebWeave data. Keeping existing file."
  fi
}

# Run initial WebWeave sync on startup
sync_webweave

# --- Watchdog Configuration ---
MAX_FAILURES=20
FAILURE_WINDOW=120
LOG_FILE="/tmp/clawdbot-watchdog.log"
WEBWEAVE_SYNC_INTERVAL=86400
LAST_WEBWEAVE_SYNC="$(date +%s)"

echo "[watchdog] Starting clawdbot gateway with reconnection watchdog" | tee "$LOG_FILE"
echo "[watchdog] Will restart after $MAX_FAILURES WS failures within ${FAILURE_WINDOW}s" | tee -a "$LOG_FILE"
echo "[watchdog] WebWeave DB re-syncs every 24 hours" | tee -a "$LOG_FILE"

while true; do
  FAIL_COUNT=0
  LAST_FAIL_TIME=0

  # Check if WebWeave sync is due (every 24h)
  NOW_CHECK="$(date +%s)"
  SINCE_SYNC="$((NOW_CHECK - LAST_WEBWEAVE_SYNC))"
  if [ "$SINCE_SYNC" -ge "$WEBWEAVE_SYNC_INTERVAL" ]; then
    sync_webweave
    LAST_WEBWEAVE_SYNC="$(date +%s)"
  fi

  clawdbot gateway 2>&1 | while IFS= read -r line; do
    echo "$line"
    case "$line" in
      *"WebSocket connection closed with code 100"*|*"connection stalled"*|*"no HELLO received"*)
        NOW="$(date +%s)"
        if [ "$LAST_FAIL_TIME" -gt 0 ]; then
          ELAPSED="$((NOW - LAST_FAIL_TIME))"
          if [ "$ELAPSED" -gt "$FAILURE_WINDOW" ]; then
            FAIL_COUNT=0
          fi
        fi
        FAIL_COUNT="$((FAIL_COUNT + 1))"
        LAST_FAIL_TIME="$NOW"
        if [ "$FAIL_COUNT" -ge "$MAX_FAILURES" ]; then
          echo "[watchdog] $FAIL_COUNT WS failures - forcing restart" | tee -a "$LOG_FILE"
          pkill -f "clawdbot" 2>/dev/null || true
          break
        fi
        ;;
      *"logged in to discord"*)
        FAIL_COUNT=0
        echo "[watchdog] Discord connected - counter reset" | tee -a "$LOG_FILE"
        ;;
    esac
  done

  EXIT_CODE="$?"
  echo "[watchdog] clawdbot exited (code: $EXIT_CODE) - restarting in 5s..." | tee -a "$LOG_FILE"
  sleep 5

  # Re-inject configs on each restart
  sed "s|__DISCORD_BOT_TOKEN__|${DISCORD_BOT_TOKEN}|g" \
    /root/.clawdbot/clawdbot.json.template > /root/.clawdbot/clawdbot.json

  mkdir -p "$AGENT_DIR"
  printf '{\n  "deepseek": {\n    "apiKey": "%s"\n  }\n}\n' "${DEEPSEEK_API_KEY}" > "$AGENT_DIR/auth-profiles.json"
done
