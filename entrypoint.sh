#!/bin/sh

# === Director Bot Entrypoint ===
# Clean, fast startup. No WebSocket watchdog bloat.
# Uses only: DISCORD_BOT_TOKEN, DEEPSEEK_API_KEY, DISCORD_APP_ID

echo "[director] Starting up..."

# --- Inject environment vars into clawdbot config ---
echo "[director] Injecting env vars into config..."
sed -e "s|__DISCORD_BOT_TOKEN__|${DISCORD_BOT_TOKEN}|g" \
    -e "s|__DEEPSEEK_API_KEY__|${DEEPSEEK_API_KEY}|g" \
        -e "s|__DISCORD_APP_ID__|${DISCORD_APP_ID}|g" \
            /root/.clawdbot/clawdbot.json.template > /root/.clawdbot/clawdbot.json

            # --- Write auth-profiles.json for DeepSeek provider ---
            AGENT_DIR="/data/.clawdbot/agents/main/agent"
            mkdir -p "$AGENT_DIR"
            printf '{\n  "deepseek": {\n    "apiKey": "%s"\n  }\n}\n' "${DEEPSEEK_API_KEY}" > "$AGENT_DIR/auth-profiles.json"

            # --- Git Setup for /reread self-update ---
            echo "[director] Setting up git..."
            cd /root/clawd

            # Fix: use 'main' as default branch to match GitHub repo
            git config --global init.defaultBranch main
            git config --global user.email "bot@xeriaco.com"
            git config --global user.name "Director"
            git config --global --add safe.directory /root/clawd

            if [ ! -d ".git" ]; then
                git init
                    git remote add origin https://github.com/Diamondbanana420/director-clawdbot.git
                        git fetch origin main --depth=1
                            git checkout -f origin/main -- workspace/
                                cp -r workspace/* . 2>/dev/null || true
                                    # Create initial commit so branch 'main' exists with commits
                                        git add -A 2>/dev/null || true
                                            git commit -m "Initial workspace setup" 2>/dev/null || true
                                            fi

                                            # --- Create required directories and placeholder files ---
                                            mkdir -p /root/clawd/memory

                                            # Memory placeholders: create today AND yesterday (UTC) to prevent ENOENT
                                            TODAY="$(date -u '+%Y-%m-%d')"
                                            YESTERDAY="$(date -u -d '1 day ago' '+%Y-%m-%d' 2>/dev/null || date -u -v-1d '+%Y-%m-%d' 2>/dev/null || echo '')"

                                            if [ ! -f "/root/clawd/memory/${TODAY}.md" ]; then
                                                printf "# %s\n\n" "$TODAY" > "/root/clawd/memory/${TODAY}.md"
                                                fi

                                                if [ -n "$YESTERDAY" ] && [ ! -f "/root/clawd/memory/${YESTERDAY}.md" ]; then
                                                    printf "# %s\n\n" "$YESTERDAY" > "/root/clawd/memory/${YESTERDAY}.md"
                                                    fi

                                                    # Knowledge base placeholder
                                                    if [ ! -f "/root/clawd/WEBWEAVE_KNOWLEDGE.md" ]; then
                                                        printf "# WebWeave Knowledge Base\n*Not configured.*\n" > "/root/clawd/WEBWEAVE_KNOWLEDGE.md"
                                                        fi

                                                        echo "[director] Setup complete. Launching gateway..."

                                                        # --- Simple healthcheck endpoint ---
                                                        # Writes a heartbeat file that the Dockerfile HEALTHCHECK can poll
                                                        HEALTH_FILE="/tmp/director-health"
                                                        echo "ok" > "$HEALTH_FILE"

                                                        # --- Main loop: run gateway, restart on crash ---
                                                        while true; do
                                                            # Update healthcheck timestamp
                                                                date -u '+%Y-%m-%dT%H:%M:%SZ' > "$HEALTH_FILE"

                                                                    # Run clawdbot gateway
                                                                        clawdbot gateway 2>&1

                                                                            EXIT_CODE="$?"
                                                                                echo "[director] Gateway exited (code: $EXIT_CODE). Restarting in 5s..."
                                                                                    sleep 5

                                                                                        # Re-inject config on restart
                                                                                            sed -e "s|__DISCORD_BOT_TOKEN__|${DISCORD_BOT_TOKEN}|g" \
                                                                                                    -e "s|__DEEPSEEK_API_KEY__|${DEEPSEEK_API_KEY}|g" \
                                                                                                            -e "s|__DISCORD_APP_ID__|${DISCORD_APP_ID}|g" \
                                                                                                                    /root/.clawdbot/clawdbot.json.template > /root/.clawdbot/clawdbot.json
                                                                                                                    
                                                                                                                        mkdir -p "$AGENT_DIR"
                                                                                                                            printf '{\n  "deepseek": {\n    "apiKey": "%s"\n  }\n}\n' "${DEEPSEEK_API_KEY}" > "$AGENT_DIR/auth-profiles.json"
                                                                                                                            
                                                                                                                                # Rotate memory: create today's + yesterday's file if new day
                                                                                                                                    NEW_TODAY="$(date -u '+%Y-%m-%d')"
                                                                                                                                        NEW_YESTERDAY="$(date -u -d '1 day ago' '+%Y-%m-%d' 2>/dev/null || date -u -v-1d '+%Y-%m-%d' 2>/dev/null || echo '')"
                                                                                                                                        
                                                                                                                                            if [ ! -f "/root/clawd/memory/${NEW_TODAY}.md" ]; then
                                                                                                                                                    printf "# %s\n\n" "$NEW_TODAY" > "/root/clawd/memory/${NEW_TODAY}.md"
                                                                                                                                                        fi
                                                                                                                                                        
                                                                                                                                                            if [ -n "$NEW_YESTERDAY" ] && [ ! -f "/root/clawd/memory/${NEW_YESTERDAY}.md" ]; then
                                                                                                                                                                    printf "# %s\n\n" "$NEW_YESTERDAY" > "/root/clawd/memory/${NEW_YESTERDAY}.md"
                                                                                                                                                                        fi
                                                                                                                                                                        done
