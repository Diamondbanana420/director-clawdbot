#!/bin/sh

# Inject Discord token into config
sed "s|__DISCORD_BOT_TOKEN__|${DISCORD_BOT_TOKEN}|g" \
  /root/.clawdbot/clawdbot.json.template > /root/.clawdbot/clawdbot.json

# --- Watchdog Configuration ---
# Max consecutive WebSocket failures before forcing a restart
MAX_FAILURES=20
# Time window (seconds) - reset counter if no failure within this period
FAILURE_WINDOW=120
LOG_FILE="/tmp/clawdbot-watchdog.log"

echo "[watchdog] Starting clawdbot gateway with reconnection watchdog" | tee "$LOG_FILE"
echo "[watchdog] Will restart after $MAX_FAILURES consecutive WS failures within ${FAILURE_WINDOW}s window" | tee -a "$LOG_FILE"

while true; do
  FAIL_COUNT=0
  LAST_FAIL_TIME=0

  # Start clawdbot gateway, piping output through watchdog monitor
  clawdbot gateway 2>&1 | while IFS= read -r line; do
    echo "$line"

    # Check for WebSocket reconnection failure pattern
    case "$line" in
      *"WebSocket connection closed with code 100"*|*"connection stalled"*|*"no HELLO received"*)
        NOW=$(date +%s)

        # Reset counter if outside the time window
        if [ "$LAST_FAIL_TIME" -gt 0 ]; then
          ELAPSED=$((NOW - LAST_FAIL_TIME))
          if [ "$ELAPSED" -gt "$FAILURE_WINDOW" ]; then
            FAIL_COUNT=0
          fi
        fi

        FAIL_COUNT=$((FAIL_COUNT + 1))
        LAST_FAIL_TIME=$NOW

        if [ "$FAIL_COUNT" -ge "$MAX_FAILURES" ]; then
          echo "[watchdog] Detected $FAIL_COUNT consecutive WebSocket failures - forcing restart" | tee -a "$LOG_FILE"
          # Kill all clawdbot processes to force a clean restart
          pkill -f "clawdbot" 2>/dev/null || true
          break
        fi
        ;;
      *"logged in to discord"*)
        # Successful connection - reset failure counter
        FAIL_COUNT=0
        echo "[watchdog] Discord connection established - failure counter reset" | tee -a "$LOG_FILE"
        ;;
    esac
  done

  EXIT_CODE=$?
  echo "[watchdog] clawdbot gateway exited (code: $EXIT_CODE) - restarting in 5 seconds..." | tee -a "$LOG_FILE"
  sleep 5

  # Re-inject config in case env vars changed
  sed "s|__DISCORD_BOT_TOKEN__|${DISCORD_BOT_TOKEN}|g" \
    /root/.clawdbot/clawdbot.json.template > /root/.clawdbot/clawdbot.json
done
