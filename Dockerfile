FROM node:22-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
        procps \
            curl \
                python3 \
                    python3-pip \
                        python3-venv \
                            && pip3 install --break-system-packages requests \
                                && rm -rf /var/lib/apt/lists/*

                                # Install clawdbot
                                RUN npm install -g clawdbot@latest --legacy-peer-deps

                                # Create directories
                                RUN mkdir -p /root/clawd /root/.clawdbot /root/clawd/memory

                                WORKDIR /root/clawd

                                # Copy only core workspace files (not the 100+ legacy files)
                                COPY workspace/AGENTS.md workspace/SOUL.md workspace/USER.md workspace/IDENTITY.md \
                                     workspace/MEMORY.md workspace/HEARTBEAT.md workspace/TOOLS.md \
                                          workspace/ROLE_DEFINITION.md workspace/BOOTSTRAP.md workspace/README.md \
                                               /root/clawd/

                                               # Copy skills directory
                                               COPY workspace/skills/ /root/clawd/skills/

                                               # Copy config template and entrypoint
                                               COPY clawdbot.json /root/.clawdbot/clawdbot.json.template
                                               COPY entrypoint.sh /root/entrypoint.sh
                                               RUN chmod +x /root/entrypoint.sh

                                               ENV HOME=/root

                                               EXPOSE 18789

                                               # Healthcheck: verify the gateway is alive
                                               HEALTHCHECK --interval=60s --timeout=10s --retries=3 \
                                                   CMD test -f /tmp/director-health && test "$(find /tmp/director-health -mmin -5)" != "" || exit 1

                                                   CMD ["/root/entrypoint.sh"]