FROM node:20-slim

# Install git (required for clawdbot npm install)
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Install clawdbot globally
RUN npm install -g clawdbot

# Create workspace directories
RUN mkdir -p /root/clawd /root/.clawdbot

# Set working directory
WORKDIR /root/clawd

# Copy workspace files
COPY workspace/ /root/clawd/

# Copy clawdbot config
COPY clawdbot.json /root/.clawdbot/clawdbot.json

# Expose gateway port
EXPOSE 18789

# Start clawdbot gateway
CMD ["clawdbot", "gateway", "start", "--foreground"]
