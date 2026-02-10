# 🤖 Autonomous Clawdbot Deployment Instructions

## 🎯 Mission: Deploy XeriacoBot2 Without Manual Emergent Interaction

Ben - here's your **completely autonomous** second Clawdbot deployment! No need to prompt Emergent manually.

## 📦 What You Get

- **XeriacoBot2**: Your second autonomous assistant
- **Port 8081**: Separate from main bot (avoiding conflicts)
- **Independent Storage**: Isolated data and workspace
- **Auto-Recovery**: Systemd service with restart capabilities
- **Web Setup**: No terminal commands needed after deployment

## 🚀 One-Command Deployment

```bash
# Copy to your Emergent server and run
scp autonomous_deploy.sh docker-compose-bot2.yml user@your-server.com:/tmp/
ssh user@your-server.com 'chmod +x /tmp/autonomous_deploy.sh && /tmp/autonomous_deploy.sh'
```

**That's it!** The script does everything automatically:
- ✅ Installs Docker if missing
- ✅ Builds Clawdbot image  
- ✅ Creates isolated container
- ✅ Sets up systemd service
- ✅ Generates unique credentials
- ✅ Starts the service

## 🔐 Access Credentials

**Setup Password**: `xeriaco_bot2_2026_secure`
**Gateway Token**: `clawdbot_auto_f8e4a9b2c3d1e7f6a5b8c9d0e1f2a3b4`

## 🌐 Access URLs

**Setup Wizard**: `http://your-server-ip:8081/setup`
**Control UI**: `http://your-server-ip:8081/clawdbot`

## 📋 Post-Deployment Setup

1. **Open Setup Wizard**
   - Go to: `http://your-server-ip:8081/setup`
   - Password: `xeriaco_bot2_2026_secure`

2. **Add Model Provider**
   - OpenAI API Key: `sk-...`
   - Or Anthropic API Key: `sk-ant-...`
   - Choose model (gpt-4 or claude-sonnet)

3. **Configure Chat Channels**
   
   **Discord Bot:**
   ```
   1. Go to https://discord.com/developers/applications
   2. Create New Application → "XeriacoBot2"
   3. Bot → Add Bot → Copy Token
   4. Enable "MESSAGE CONTENT INTENT"
   5. Paste token into setup wizard
   ```
   
   **Telegram Bot:**
   ```
   1. Message @BotFather in Telegram
   2. /newbot → "XeriacoBot2"
   3. Copy token (123456:AA...)
   4. Paste into setup wizard
   ```

4. **Complete Setup**
   - Click "Run Setup"
   - Bot starts automatically
   - Access Control UI

## 🎯 XeriaCo Integration Ideas

**Marketing Automation Bot:**
- Social media posting (X, Instagram, TikTok)
- Customer service automation
- Influencer outreach campaigns
- Content creation for products

**Backup Store Monitor:**
- Redundant store monitoring
- Different notification channels
- Backup order processing
- Competitor analysis automation

**Growth Hacking Bot:**
- SEO content generation
- Product review monitoring
- Price tracking competitors
- Email marketing campaigns

## 🔧 Service Management

```bash
# Start service
sudo systemctl start xeriacobot2

# Stop service  
sudo systemctl stop xeriacobot2

# Check status
sudo systemctl status xeriacobot2

# View logs
cd /opt/xeriacobot2 && sudo docker-compose logs -f

# Restart if needed
sudo systemctl restart xeriacobot2
```

## 🛡️ Security Features

- ✅ **Isolated Container**: No access to main bot data
- ✅ **Unique Credentials**: Auto-generated passwords and tokens
- ✅ **Separate Port**: No conflicts with existing services
- ✅ **Health Monitoring**: Auto-restart on failures
- ✅ **Persistent Storage**: Data survives container restarts

## 🚀 Advanced Configuration

**Custom Environment Variables:**
Edit `/opt/xeriacobot2/docker-compose.yml` and add:

```yaml
environment:
  - CUSTOM_VAR=value
  - ANOTHER_SETTING=123
```

**Resource Limits:**
Add to docker-compose.yml:

```yaml
deploy:
  resources:
    limits:
      cpus: '1.0'
      memory: 2G
```

**Backup Configuration:**
```bash
# Backup bot data
sudo docker cp xeriacobot2:/data /backup/bot2-$(date +%Y%m%d)

# Restore bot data
sudo docker cp /backup/bot2-backup/ xeriacobot2:/data
```

## 💰 Business Impact

**Dual Bot Strategy:**
- **Bot 1**: Core store monitoring (products, orders, health)
- **Bot 2**: Marketing and growth (social media, customer acquisition)

**Expected Results:**
- 2x automation coverage
- Redundant monitoring (never miss a sale!)
- Dedicated marketing campaigns
- Faster customer response times

## 🎉 Success Confirmation

After deployment, you should see:
- ✅ Container running: `sudo docker ps | grep xeriacobot2`
- ✅ Service active: `sudo systemctl status xeriacobot2`
- ✅ Web access: Setup wizard responds on port 8081
- ✅ Logs flowing: `sudo docker-compose logs -f`

## 🆘 Troubleshooting

**Service won't start:**
```bash
sudo docker-compose logs
sudo systemctl status xeriacobot2
```

**Port already in use:**
Edit docker-compose.yml and change `8081:8081` to `8082:8081`

**Permission errors:**
```bash
sudo chown -R 1000:1000 /opt/xeriacobot2
```

**Can't access setup:**
Check firewall: `sudo ufw allow 8081`

---

## 🎯 Ready for Deployment!

**Your autonomous second bot is ready to deploy!**

Run the autonomous_deploy.sh script and watch your XeriaCo empire expand! 🚀💰

**Two bots = Double the automation = More money!** 🤖💸