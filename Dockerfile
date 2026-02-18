FROM node:22-slim

# Install git and system utilities needed by clawdbot tools
RUN apt-get update && apt-get install -y git procps curl && rm -rf /var/lib/apt/lists/*

# Install clawdbot globally with npm (force clean install)
RUN npm cache clean --force && npm install -g clawdbot@latest --legacy-peer-deps

# Create workspace and memory directories
RUN mkdir -p /root/clawd /root/.clawdbot /root/clawd/memory

# Set working directory
WORKDIR /root/clawd

# Copy workspace files
COPY workspace/ /root/clawd/

# Copy clawdbot config template (contains placeholders)
COPY clawdbot.json /root/.clawdbot/clawdbot.json.template

# Create entrypoint script that injects env vars into config
RUN printf '#!/bin/sh\nset -e\nsed "s|__DISCORD_BOT_TOKEN__|${DISCORD_BOT_TOKEN}|g" /root/.clawdbot/clawdbot.json.template > /root/.clawdbot/clawdbot.json\nexec clawdbot gateway\n' > /root/entrypoint.sh && chmod +x /root/entrypoint.sh

# Set HOME for clawdbot
ENV HOME=/root

# Expose gateway port
EXPOSE 18789

# Start with entrypoint that injects secrets then runs gateway
CMD ["/root/entrypoint.sh"]
