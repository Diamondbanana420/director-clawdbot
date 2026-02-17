FROM node:22-slim

# Install git and system utilities needed by clawdbot tools
RUN apt-get update && apt-get install -y git procps && rm -rf /var/lib/apt/lists/*

# Install clawdbot globally with npm (force clean install)
RUN npm cache clean --force && npm install -g clawdbot@latest --legacy-peer-deps

# Create workspace and memory directories
RUN mkdir -p /root/clawd /root/.clawdbot /root/clawd/memory

# Set working directory
WORKDIR /root/clawd

# Copy workspace files
COPY workspace/ /root/clawd/

# Copy clawdbot config
COPY clawdbot.json /root/.clawdbot/clawdbot.json

# Set HOME for clawdbot
ENV HOME=/root

# Expose gateway port
EXPOSE 18789

# Start clawdbot gateway (runs in foreground)
CMD ["clawdbot", "gateway"]
