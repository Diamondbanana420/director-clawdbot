#!/bin/sh

# --- Inject environment vars into clawdbot config ---
echo "[setup] Injecting env vars into clawdbot config..."
sed -e "s|__DISCORD_BOT_TOKEN__|${DISCORD_BOT_TOKEN}|g" \
    -e "s|__DEEPSEEK_API_KEY__|${DEEPSEEK_API_KEY}|g" \
    -e "s|__DISCORD_APP_ID__|${DISCORD_APP_ID}|g" \
    /root/.clawdbot/clawdbot.json.template > /root/.clawdbot/clawdbot.json
echo "[setup] clawdbot.json rendered"

# --- Write auth-profiles.json for DeepSeek provider ---
# clawdbot looks for API keys in auth-profiles.json inside the agent dir.
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

# --- Weaviate Knowledge Base Sync ---
# Queries the Weaviate vector DB via GraphQL to export all stored objects.
# Writes results to WEBWEAVE_KNOWLEDGE.md which the agent reads as context.
sync_webweave() {
  echo "[weaviate] Starting knowledge base sync..."
  if [ -z "${WEBWEAVE_API_URL}" ]; then
    echo "[weaviate] WEBWEAVE_API_URL not set - skipping sync"
    return 0
  fi

  KNOWLEDGE_FILE="/root/clawd/WEBWEAVE_KNOWLEDGE.md"
  WEAVIATE_URL="${WEBWEAVE_API_URL}"
  WEAVIATE_KEY="${WEBWEAVE_API_KEY}"
  TIMESTAMP="$(date -u '+%Y-%m-%d %H:%M UTC')"

  # Step 1: Get schema to discover all collections
  echo "[weaviate] Fetching schema..."
  SCHEMA_JSON="$(curl -sf --max-time 15 \
    -H "Authorization: Bearer $WEAVIATE_KEY" \
    "$WEAVIATE_URL/v1/schema" 2>/dev/null)"

  if [ $? -ne 0 ] || [ -z "$SCHEMA_JSON" ]; then
    echo "[weaviate] WARNING: Failed to fetch schema. Keeping existing knowledge file."
    return 1
  fi

  # Extract class names using basic string parsing (no jq dependency)
  CLASSES="$(echo "$SCHEMA_JSON" | grep -o '"class":"[^"]*"' | cut -d: -f2 | tr -d '"')"

  if [ -z "$CLASSES" ]; then
    echo "[weaviate] Schema is empty - no collections found yet. Writing placeholder."
    printf "# WebWeave Knowledge Base\n*Last synced: %s*\n\nNo data yet - database is empty.\n" "$TIMESTAMP" > "$KNOWLEDGE_FILE"
    return 0
  fi

  echo "[weaviate] Found collections: $CLASSES"

  # Step 2: Write header
  printf "# WebWeave Knowledge Base\n" > "$KNOWLEDGE_FILE"
  printf "*Last synced: %s*\n\n" "$TIMESTAMP" >> "$KNOWLEDGE_FILE"
  printf "Use as authoritative context for: openclaw bots, VPS, business,\n" >> "$KNOWLEDGE_FILE"
  printf "marketing, Xeriaco, n8n, dropshipping, making money online.\n\n" >> "$KNOWLEDGE_FILE"
  printf "---\n\n" >> "$KNOWLEDGE_FILE"

  # Step 3: For each collection, query all objects via GraphQL
  TOTAL_OBJECTS=0
  for CLASS in $CLASSES; do
    echo "[weaviate] Querying collection: $CLASS"

    # Get property names for this class
    PROPS="$(echo "$SCHEMA_JSON" | grep -A 200 '"class":"'"$CLASS"'"' | grep -o '"name":"[^"]*"' | head -20 | cut -d: -f2 | tr -d '"' | head -10)"

    if [ -n "$PROPS" ]; then
      PROP_LIST="$(echo "$PROPS" | tr '\n' ' ' | sed 's/ *$//')"
      GQL_BODY="$(printf '{"query":"{ Get { %s { %s _additional { id creationTimeUnix } } } }"}' "$CLASS" "$PROP_LIST")"
    else
      GQL_BODY="$(printf '{"query":"{ Get { %s { _additional { id creationTimeUnix } } } }"}' "$CLASS")"
    fi

    RESULT="$(curl -sf --max-time 30 \
      -X POST \
      -H "Authorization: Bearer $WEAVIATE_KEY" \
      -H "Content-Type: application/json" \
      -d "$GQL_BODY" \
      "$WEAVIATE_URL/v1/graphql" 2>/dev/null)"

    if [ $? -eq 0 ] && [ -n "$RESULT" ]; then
      OBJ_COUNT="$(echo "$RESULT" | grep -o '"id"' | wc -l)"
      TOTAL_OBJECTS="$((TOTAL_OBJECTS + OBJ_COUNT))"
      printf "## Collection: %s\n" "$CLASS" >> "$KNOWLEDGE_FILE"
      printf "%s\n\n" "$RESULT" >> "$KNOWLEDGE_FILE"
      echo "[weaviate] $CLASS: $OBJ_COUNT objects fetched"
    else
      echo "[weaviate] WARNING: Could not fetch data for $CLASS"
      printf "## Collection: %s\n(fetch failed)\n\n" "$CLASS" >> "$KNOWLEDGE_FILE"
    fi
  done

  printf "\n---\n*%s total objects. Auto-synced daily.*\n" "$TOTAL_OBJECTS" >> "$KNOWLEDGE_FILE"
  echo "[weaviate] Sync complete: $TOTAL_OBJECTS total objects"
}

# Run initial Weaviate sync on startup
sync_webweave

# --- Watchdog Configuration ---
MAX_FAILURES=20
FAILURE_WINDOW=120
LOG_FILE="/tmp/clawdbot-watchdog.log"
WEAVIATE_SYNC_INTERVAL=86400
LAST_WEAVIATE_SYNC="$(date +%s)"

echo "[watchdog] Starting clawdbot gateway with reconnection watchdog" | tee "$LOG_FILE"
echo "[watchdog] Will restart after $MAX_FAILURES WS failures within ${FAILURE_WINDOW}s" | tee -a "$LOG_FILE"
echo "[watchdog] Weaviate DB re-syncs every 24 hours" | tee -a "$LOG_FILE"

while true; do
  FAIL_COUNT=0
  LAST_FAIL_TIME=0

  # Check if Weaviate sync is due (every 24h)
  NOW_CHECK="$(date +%s)"
  SINCE_SYNC="$((NOW_CHECK - LAST_WEAVIATE_SYNC))"
  if [ "$SINCE_SYNC" -ge "$WEAVIATE_SYNC_INTERVAL" ]; then
    sync_webweave
    LAST_WEAVIATE_SYNC="$(date +%s)"
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
  sed -e "s|__DISCORD_BOT_TOKEN__|${DISCORD_BOT_TOKEN}|g" \
      -e "s|__DEEPSEEK_API_KEY__|${DEEPSEEK_API_KEY}|g" \
      -e "s|__DISCORD_APP_ID__|${DISCORD_APP_ID}|g" \
      /root/.clawdbot/clawdbot.json.template > /root/.clawdbot/clawdbot.json
  mkdir -p "$AGENT_DIR"
  printf '{\n  "deepseek": {\n    "apiKey": "%s"\n  }\n}\n' "${DEEPSEEK_API_KEY}" > "$AGENT_DIR/auth-profiles.json"
done
