# 🤖 XeriaCo Bot Army Deployment Guide

## 📂 WHERE TO PUT FILES:

**On your local machine (where you'll run the deployment):**
```
/your-deployment-folder/
├── deploy-bot-army.sh          # Main deployment script
├── discord-tokens.txt          # Your Discord bot tokens
└── discord-setup.md            # Setup instructions (auto-generated)
```

## 🚀 QUICK START:

### Step 1: Create Discord Bots
1. Go to https://discord.com/developers/applications
2. Create 5 new applications with these names:
   - `XeriaCo Store Manager`
   - `XeriaCo Price Monitor`
   - `XeriaCo Content Creator`  
   - `XeriaCo Analytics`
   - `XeriaCo Support`

### Step 2: Get Tokens
1. For each bot → **Bot** tab → **Reset Token**
2. Copy tokens to `discord-tokens.txt`:
```
MTQ2ODA...store_manager_token
MTQ2ODA...price_monitor_token
MTQ2ODA...content_creator_token
MTQ2ODA...analytics_token  
MTQ2ODA...support_token
```

### Step 3: Invite to Discord
For each bot, use this URL (replace `YOUR_CLIENT_ID`):
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot
```

### Step 4: Deploy!
```bash
# Make script executable
chmod +x deploy-bot-army.sh

# Deploy 3 bots (recommended start)
./deploy-bot-army.sh 3

# Or deploy all 5 roles
./deploy-bot-army.sh 5
```

## 🤖 BOT SPECIALIZATIONS:

**🏪 Store Manager Bot:**
- Shopify automation
- Inventory management
- Order processing
- Commands: `@StoreBot optimize checkout`

**💰 Price Monitor Bot:**
- 24/7 competitor tracking
- Price alerts
- Margin protection
- Commands: `@PriceBot check competitors`

**📝 Content Creator Bot:**
- Product descriptions
- Social media posts
- Email campaigns
- Commands: `@ContentBot write product copy`

**📊 Analytics Bot:**
- Performance tracking
- Revenue reports
- Customer insights
- Commands: `@AnalyticsBot weekly report`

**💬 Support Bot:**
- Customer service automation
- FAQ responses
- Ticket routing
- Commands: `@SupportBot handle inquiry`

## 📡 AFTER DEPLOYMENT:

Bots will announce in your Discord when ready:
```
🤖 Store Manager Bot #1 deployed and ready for XeriaCo operations!
🤖 Price Monitor Bot #2 deployed and ready for XeriaCo operations!
```

## 🎯 USAGE EXAMPLES:

```
@StoreBot audit xeria-378.myshopify.com performance
@PriceBot monitor water bottle competitors  
@ContentBot create product description for new item
@AnalyticsBot generate conversion report
@SupportBot set up FAQ automation
```

## 💰 COSTS:

**Recommended Setup (3 bots):**
- Oracle Free Tier: $0/month (1 bot)
- DigitalOcean: $12/month (2 bots @ $6 each)
- **Total: $12/month for 3 specialized bots**

## 🛟 TROUBLESHOOTING:

**If deployment fails:**
1. Check cloud CLI is installed (`doctl`, `oci`, etc.)
2. Verify Discord tokens are valid
3. Check `deployed-ips.txt` for successful deployments
4. Monitor Discord for bot announcements

**Manual deployment:**
If auto-deployment fails, the script generates cloud-init files you can upload manually to any Ubuntu server.