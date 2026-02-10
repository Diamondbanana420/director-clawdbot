#!/usr/bin/env node

/**
 * Autonomous Clawdbot Deployer for Emergent Servers
 * Deploys a second Clawdbot instance without manual Emergent interaction
 */

const https = require('https');
const fs = require('fs').promises;

class AutonomousClawdbotDeployer {
  constructor() {
    this.emergentEndpoint = 'your-emergent-server.com'; // Ben will provide
    this.deploymentConfig = {
      botName: 'XeriacoBot2',
      dockerImage: 'clawdbot:latest',
      port: 8081, // Different from main instance
      volume: '/data-bot2',
      envVars: {
        PORT: '8081',
        CLAWDBOT_STATE_DIR: '/data-bot2/.clawdbot',
        CLAWDBOT_WORKSPACE_DIR: '/data-bot2/workspace',
        SETUP_PASSWORD: this.generateSecurePassword(),
        CLAWDBOT_GATEWAY_TOKEN: this.generateSecureToken()
      }
    };
  }

  generateSecurePassword() {
    return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  }

  generateSecureToken() {
    return 'clawdbot_' + Array.from({length: 32}, () => 
      Math.floor(Math.random() * 16).toString(16)).join('');
  }

  async deployToEmergent() {
    console.log('🚀 Starting Autonomous Clawdbot Deployment...');
    
    try {
      // Step 1: Generate deployment configuration
      const dockerConfig = await this.generateDockerConfig();
      
      // Step 2: Create deployment script
      const deployScript = await this.createDeploymentScript();
      
      // Step 3: Generate setup instructions 
      const setupInstructions = this.generateSetupInstructions();
      
      console.log('✅ Deployment files generated!');
      console.log('📋 Next steps:');
      console.log('1. Copy deployment files to Emergent server');
      console.log('2. Run deployment script');
      console.log('3. Access setup wizard');
      
      return {
        dockerConfig,
        deployScript,
        setupInstructions,
        credentials: {
          setupPassword: this.deploymentConfig.envVars.SETUP_PASSWORD,
          gatewayToken: this.deploymentConfig.envVars.CLAWDBOT_GATEWAY_TOKEN
        }
      };
      
    } catch (error) {
      console.error('❌ Deployment failed:', error.message);
      throw error;
    }
  }

  async generateDockerConfig() {
    const dockerCompose = `version: '3.8'

services:
  ${this.deploymentConfig.botName.toLowerCase()}:
    image: ${this.deploymentConfig.dockerImage}
    container_name: ${this.deploymentConfig.botName.toLowerCase()}
    restart: unless-stopped
    ports:
      - "${this.deploymentConfig.port}:${this.deploymentConfig.port}"
    volumes:
      - ${this.deploymentConfig.volume}:/data
    environment:
${Object.entries(this.deploymentConfig.envVars).map(([key, value]) => 
  `      - ${key}=${value}`).join('\\n')}
    networks:
      - clawdbot-network

networks:
  clawdbot-network:
    driver: bridge

volumes:
  ${this.deploymentConfig.volume.replace('/', '')}:
    driver: local
`;

    return dockerCompose;
  }

  async createDeploymentScript() {
    const deployScript = `#!/bin/bash

# Autonomous Clawdbot Deployment Script
# Generated automatically - no manual intervention required

set -e

echo "🤖 Autonomous Clawdbot Deployment Starting..."
echo "============================================="

# Check requirements
echo "📋 Checking requirements..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found - installing..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose not found - installing..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Create deployment directory
DEPLOY_DIR="/opt/${this.deploymentConfig.botName.toLowerCase()}"
sudo mkdir -p $DEPLOY_DIR
cd $DEPLOY_DIR

# Pull Clawdbot image
echo "📦 Pulling Clawdbot image..."
sudo docker pull node:22-bookworm

# Create Clawdbot Docker image if needed
echo "🔨 Building Clawdbot image..."
cat > Dockerfile << 'EOF'
FROM node:22-bookworm

# Install global dependencies
RUN npm install -g clawdbot@latest pnpm

# Setup working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \\
    curl \\
    git \\
    vim \\
    && rm -rf /var/lib/apt/lists/*

# Expose port
EXPOSE ${this.deploymentConfig.port}

# Start command
CMD ["npx", "clawdbot", "gateway", "--port", "${this.deploymentConfig.port}"]
EOF

# Build the image
sudo docker build -t ${this.deploymentConfig.dockerImage} .

# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
$(cat dockercompose.yml)
EOF

# Create data directory with proper permissions
sudo mkdir -p ${this.deploymentConfig.volume}
sudo chown -R 1000:1000 ${this.deploymentConfig.volume}

# Deploy the service
echo "🚀 Deploying Clawdbot service..."
sudo docker-compose up -d

# Wait for service to start
echo "⏳ Waiting for service to start..."
sleep 30

# Check if service is running
if sudo docker-compose ps | grep -q "Up"; then
    echo "✅ Clawdbot deployed successfully!"
    echo ""
    echo "📋 Service Information:"
    echo "Container: ${this.deploymentConfig.botName.toLowerCase()}"
    echo "Port: ${this.deploymentConfig.port}"
    echo "Setup URL: http://localhost:${this.deploymentConfig.port}/setup"
    echo "Setup Password: ${this.deploymentConfig.envVars.SETUP_PASSWORD}"
    echo "Gateway Token: ${this.deploymentConfig.envVars.CLAWDBOT_GATEWAY_TOKEN}"
    echo ""
    echo "🎯 Next: Open setup URL and configure your bot!"
else
    echo "❌ Deployment failed - check logs:"
    sudo docker-compose logs
fi
`;

    return deployScript;
  }

  generateSetupInstructions() {
    return `
# 🤖 Autonomous Clawdbot Setup Instructions

## Deployment Summary
- **Bot Name**: ${this.deploymentConfig.botName}
- **Port**: ${this.deploymentConfig.port}
- **Setup Password**: ${this.deploymentConfig.envVars.SETUP_PASSWORD}
- **Gateway Token**: ${this.deploymentConfig.envVars.CLAWDBOT_GATEWAY_TOKEN}

## Quick Deploy Commands

\`\`\`bash
# 1. Copy files to your Emergent server
scp autonomous_deploy.sh docker-compose.yml user@your-server.com:/tmp/

# 2. Run deployment (completely autonomous)
ssh user@your-server.com 'chmod +x /tmp/autonomous_deploy.sh && /tmp/autonomous_deploy.sh'

# 3. Access setup wizard
# Open: http://your-server.com:${this.deploymentConfig.port}/setup
\`\`\`

## Post-Deployment Setup

1. **Setup Wizard**: http://your-server.com:${this.deploymentConfig.port}/setup
   - Password: \`${this.deploymentConfig.envVars.SETUP_PASSWORD}\`

2. **Configure Model Provider**:
   - Add your OpenAI/Anthropic API key
   - Choose your preferred model

3. **Add Chat Channels**:
   - Telegram: Paste bot token from @BotFather
   - Discord: Add bot token + enable message content intent

4. **Final Access**:
   - Control UI: http://your-server.com:${this.deploymentConfig.port}/clawdbot
   - Gateway Token: \`${this.deploymentConfig.envVars.CLAWDBOT_GATEWAY_TOKEN}\`

## Security Notes

- ✅ Unique passwords and tokens generated automatically
- ✅ Isolated Docker container with persistent storage
- ✅ Separate port from main Clawdbot instance
- ✅ No manual Emergent interaction required

## XeriaCO Integration

Your new bot can be configured to:
- Monitor different store aspects (social media, customer service)
- Handle marketing automation
- Manage additional sales channels
- Backup/redundancy for main store monitoring

Ready to make more money with dual automation! 🚀💰
`;
  }

  async generateConfigFiles() {
    try {
      // Write docker-compose.yml
      const dockerConfig = await this.generateDockerConfig();
      await fs.writeFile('docker-compose-bot2.yml', dockerConfig);
      
      // Write deployment script
      const deployScript = await this.createDeploymentScript();
      await fs.writeFile('autonomous_deploy.sh', deployScript);
      
      // Write setup instructions
      const setupInstructions = this.generateSetupInstructions();
      await fs.writeFile('DEPLOYMENT_INSTRUCTIONS.md', setupInstructions);
      
      // Write credentials file
      const credentials = {
        botName: this.deploymentConfig.botName,
        port: this.deploymentConfig.port,
        setupPassword: this.deploymentConfig.envVars.SETUP_PASSWORD,
        gatewayToken: this.deploymentConfig.envVars.CLAWDBOT_GATEWAY_TOKEN,
        setupUrl: \`http://your-server.com:\${this.deploymentConfig.port}/setup\`,
        controlUrl: \`http://your-server.com:\${this.deploymentConfig.port}/clawdbot\`
      };
      
      await fs.writeFile('bot2_credentials.json', JSON.stringify(credentials, null, 2));
      
      console.log('📁 Files created:');
      console.log('  - docker-compose-bot2.yml');
      console.log('  - autonomous_deploy.sh');
      console.log('  - DEPLOYMENT_INSTRUCTIONS.md');
      console.log('  - bot2_credentials.json');
      
      return credentials;
      
    } catch (error) {
      console.error('❌ Failed to generate config files:', error);
      throw error;
    }
  }
}

// Auto-run if called directly
if (require.main === module) {
  const deployer = new AutonomousClawdbotDeployer();
  
  deployer.generateConfigFiles()
    .then(credentials => {
      console.log('\\n🎯 AUTONOMOUS DEPLOYMENT READY!');
      console.log('================================');
      console.log(\`Bot Name: \${credentials.botName}\`);
      console.log(\`Setup URL: \${credentials.setupUrl}\`);
      console.log(\`Setup Password: \${credentials.setupPassword}\`);
      console.log('\\n📋 Next: Run autonomous_deploy.sh on your Emergent server!');
    })
    .catch(console.error);
}

module.exports = AutonomousClawdbotDeployer;