# 🔧 CROSS-SERVER BOT RECOVERY GUIDE

## 🎯 SITUATION: Master Slave Bot on Different Emergent Server

**PROBLEM**: @1468496230643662848 (Master Slave bot) is on different Emergent server and not responding

## 💡 RECOVERY SOLUTIONS

### 🚀 OPTION 1: Remote Server Commands
**If you have access to the other Emergent server:**

```bash
# Connect to the other server and run:
ps aux | grep node | grep discord
# Check if bot process is running

# If not running, restart with:
cd /path/to/bot/directory
nohup node bot-script.js <TOKEN> > bot.log 2>&1 &
```

### 🔄 OPTION 2: Redeploy on This Server
**Simpler solution - move the Master bot to this server:**

```bash
# Use the Master bot token on THIS server
cd /root/clawd
./start-memory-bot.sh MTQ2ODgwMjY0NjQ2MTc3OTk5OA.GNCSK4.WXcXt0IeFlEx2kyBSq4i0UiJrnozxFnUPhXQbA
```

### 🎛️ OPTION 3: Cross-Server Coordination
**Keep bots on separate servers but coordinate:**

1. **Message Bridge**: Set up webhook communication between servers
2. **Shared Database**: Use common API/database for coordination  
3. **Status Monitoring**: Cross-server health checks

### ⚡ OPTION 4: Token Migration
**Move the bot completely to this server:**

1. Stop bot on other server
2. Start bot on this server with same token
3. All Discord identity/permissions preserved
4. Full control from single server

## 🎯 RECOMMENDED: Option 2 (Redeploy Here)

**Advantages:**
- Full control from one server
- Easier maintenance and monitoring  
- All bots in same location
- Simplified coordination

**Command to execute:**
```bash
cd /root/clawd
./start-memory-bot.sh MTQ2ODgwMjY0NjQ2MTc3OTk5OA.GNCSK4.WXcXt0IeFlEx2kyBSq4i0UiJrnozxFnUPhXQbA
```

This will start the Master Slave bot with full memory on THIS server!