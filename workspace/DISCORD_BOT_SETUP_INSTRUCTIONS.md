# 🤖 XeriacoBot2 Discord Bot + Clawdbot Setup

## 🎯 What You're Getting Ben

**XeriacoBot2** = Clawdbot + Discord Bot Integration for XeriaCO marketing automation!

### ✅ **Autonomous Deployment Features**
- **Clawdbot Gateway** - Web interface + API access
- **Discord Bot Integration** - Marketing commands + store monitoring  
- **Auto-sync with XeriaCO store** - Real-time product/order tracking
- **Marketing automation** - Social campaigns, flash sales, promotions
- **Customer service tools** - Order tracking, help commands

## 🚀 **One-Script Deployment**

```bash
# Copy enhanced script to your Emergent server
scp enhanced_autonomous_deploy.sh user@your-server.com:/tmp/

# Run complete deployment (Clawdbot + Discord Bot)
ssh user@your-server.com 'chmod +x /tmp/enhanced_autonomous_deploy.sh && /tmp/enhanced_autonomous_deploy.sh'
```

**The script automatically:**
- ✅ Installs Docker + Docker Compose
- ✅ Builds Clawdbot + Discord Bot container  
- ✅ Sets up systemd service
- ✅ Creates web setup wizard
- ✅ Configures XeriaCO store integration

## 🔐 **Access Information**

**Clawdbot Setup**: `http://your-server:8081/setup`
**Setup Password**: `xeriaco_bot2_2026_secure`
**Gateway Token**: `clawdbot_auto_f8e4a9b2c3d1e7f6a5b8c9d0e1f2a3b4`

## 🤖 **Discord Bot Setup (Required)**

### **Step 1: Create Discord Application**
1. Go to: https://discord.com/developers/applications
2. Click **"New Application"**
3. Name: **"XeriacoBot2"**
4. Click **"Create"**

### **Step 2: Create Bot**
1. Click **"Bot"** in left sidebar
2. Click **"Add Bot"**
3. Click **"Yes, do it!"**

### **Step 3: Configure Bot**
1. **Copy the Bot Token** (keep this secret!)
2. **Enable "MESSAGE CONTENT INTENT"** (under Privileged Gateway Intents)
3. **Save Changes**

### **Step 4: Set Bot Token**
```bash
# SSH to your server and set the Discord token
ssh user@your-server.com
cd /opt/xeriacobot2-discord
export DISCORD_BOT_TOKEN="your_bot_token_here"
sudo docker-compose restart
```

### **Step 5: Invite Bot to Server**
1. Go back to Discord Developer Portal
2. **OAuth2** → **URL Generator**
3. **Scopes**: Select `bot` and `applications.commands`
4. **Bot Permissions**: 
   - Send Messages
   - Use Slash Commands  
   - Embed Links
   - Read Message History
   - Add Reactions
5. **Copy the generated URL**
6. **Open URL** and invite bot to your Discord server

## 🎯 **Discord Commands Available**

### **📊 Store Management**
- `/store-status` - Complete XeriaCO store dashboard
- `/new-products` - Latest products ready for promotion
- `/sales-report` - Daily sales and profit metrics

### **🚀 Marketing Automation**  
- `/promote-product [name]` - Generate marketing content for any product
- `/social-campaign [platform]` - Create Instagram/TikTok/Twitter campaigns
- `/flash-sale [hours]` - Announce limited time offers with countdown

### **🎯 Customer Service**
- `/customer-help [query]` - Automated customer support responses
- `/track-order [order_id]` - Help customers track their orders

### **📈 Analytics**
- `/marketing-analytics` - Campaign performance metrics
- `/competitor-watch` - Monitor competitor activity

## 🌐 **Complete Setup Process**

### **1. Deploy Bot (5 minutes)**
```bash
scp enhanced_autonomous_deploy.sh user@your-server.com:/tmp/
ssh user@your-server.com './tmp/enhanced_autonomous_deploy.sh'
```

### **2. Setup Discord Bot (5 minutes)**
- Create Discord application
- Get bot token
- Set token on server
- Invite to Discord server

### **3. Configure Clawdbot (5 minutes)**
- Open `http://your-server:8081/setup`
- Enter setup password
- Add OpenAI/Anthropic API key
- Complete wizard

### **4. Test Everything (2 minutes)**
- Try `/store-status` in Discord
- Check Clawdbot web interface
- Verify store integration

**Total Setup Time: 15-20 minutes!** ⚡

## 💡 **Marketing Use Cases**

### **Daily Store Operations**
- **Morning**: Bot checks store status, reports new products
- **Midday**: Flash sale announcements for slow-moving items
- **Evening**: Daily sales celebration + tomorrow's promotions

### **Product Launches**
- **Pre-launch**: Teaser campaigns across social platforms
- **Launch day**: Coordinated Discord/social media announcements  
- **Post-launch**: Customer testimonials and review collection

### **Customer Engagement**
- **24/7 support**: Automated responses to common questions
- **Order tracking**: Instant status updates for customers
- **Community building**: Engaging Discord server for XeriaCO fans

## 🔧 **Service Management**

```bash
# Check bot status
sudo systemctl status xeriacobot2-discord

# View logs (Clawdbot + Discord Bot)
sudo docker-compose logs -f

# Restart everything
sudo systemctl restart xeriacobot2-discord

# Update Discord token
export DISCORD_BOT_TOKEN="new_token"
sudo docker-compose restart
```

## 📊 **Expected Results**

### **Week 1: Setup & Integration**
- Bot operational in Discord server
- Store monitoring automated
- Basic marketing commands working

### **Week 2-4: Marketing Automation**
- Daily product promotions
- Social media campaign generation
- Customer service automation
- Flash sales driving traffic

### **Month 2+: Growth & Optimization**
- Advanced marketing analytics
- Automated customer acquisition
- Community growth in Discord
- Increased sales conversion

## 🛡️ **Security Features**

- ✅ **Bot token security** - Environment variables only
- ✅ **Isolated container** - Separate from main bot
- ✅ **Discord permissions** - Minimal required access
- ✅ **Auto-restart** - Systemd service recovery
- ✅ **Health monitoring** - Both Clawdbot + Discord bot

## 🎉 **Success Indicators**

**Technical:**
- ✅ Docker container running
- ✅ Discord bot online in server
- ✅ Slash commands responding
- ✅ Store API integration working
- ✅ Clawdbot setup wizard accessible

**Business:**
- 📈 Increased Discord engagement
- 🚀 More product promotion content
- 💰 Higher conversion from marketing
- 🎯 Automated customer service
- ⚡ Faster response to store events

---

## 🚀 **Ready to Launch!**

**Ben - your enhanced XeriacoBot2 is ready to deploy!**

**One script = Clawdbot + Discord Bot + XeriaCO Integration + Marketing Automation!**

Run the script and start dominating Discord marketing! 🤖💪💸