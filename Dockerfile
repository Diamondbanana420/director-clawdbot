FROM node:20-slim

# Install git and pnpm
RUN apt-get update && apt-get install -y git curl && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm

# Install clawdbot globally via pnpm
RUN pnpm add -g clawdbot

# Create workspace directories
RUN mkdir -p /root/clawd /root/.clawdbot

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

# Start clawdbot gateway
CMD ["pnpm", "exec", "clawdbot", "gateway", "start", "--foreground"]
