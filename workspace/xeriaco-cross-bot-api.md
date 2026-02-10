# XeriaCo Cross-Bot Access API
**Optimized File Editing & System Access for Bot Coordination**

## Authorized Bot Access
- **Primary Bot**: 1468022638520832011 (XeriaCo Manager - Business Operations Director)
- **Secondary Bot**: 1468496230643662848 (Master Coordinator)
- **Authorization Level**: Full System Access

## File Access Endpoints

### 1. File Operations API
```bash
# Read File
curl -X GET 'https://moltbot-config-25.preview.emergentagent.com/api/files/read' \
  -H "Authorization: Bearer bf4765e62a04f87f5d339499fc25aa01" \
  -d '{"path": "/root/clawd/filename.md"}'

# Write File  
curl -X POST 'https://moltbot-config-25.preview.emergentagent.com/api/files/write' \
  -H "Authorization: Bearer bf4765e62a04f87f5d339499fc25aa01" \
  -d '{"path": "/root/clawd/filename.md", "content": "file content"}'

# Edit File
curl -X PUT 'https://moltbot-config-25.preview.emergentagent.com/api/files/edit' \
  -H "Authorization: Bearer bf4765e62a04f87f5d339499fc25aa01" \
  -d '{"path": "/root/clawd/filename.md", "oldText": "old", "newText": "new"}'

# List Files
curl -X GET 'https://moltbot-config-25.preview.emergentagent.com/api/files/list' \
  -H "Authorization: Bearer bf4765e62a04f87f5d339499fc25aa01" \
  -d '{"directory": "/root/clawd"}'
```

### 2. System Control Endpoints
```bash
# Reactivate System
curl -X POST 'https://moltbot-config-25.preview.emergentagent.com/api/webhook' \
  -H "Authorization: Bearer bf4765e62a04f87f5d339499fc25aa01" \
  -d '{"action": "reactivate"}'

# Execute Command
curl -X POST 'https://moltbot-config-25.preview.emergentagent.com/api/exec' \
  -H "Authorization: Bearer bf4765e62a04f87f5d339499fc25aa01" \
  -d '{"command": "ls -la /root/clawd", "workdir": "/root/clawd"}'

# Deploy Service
curl -X POST 'https://moltbot-config-25.preview.emergentagent.com/api/deploy' \
  -H "Authorization: Bearer bf4765e62a04f87f5d339499fc25aa01" \
  -d '{"service": "xeriaco-frontend", "trigger": "manual"}'
```

### 3. Bot Coordination Endpoints
```bash
# Send Message to Bot
curl -X POST 'https://moltbot-config-25.preview.emergentagent.com/api/bot/message' \
  -H "Authorization: Bearer bf4765e62a04f87f5d339499fc25aa01" \
  -d '{"targetBot": "1468022638520832011", "message": "coordination message"}'

# Share File Access
curl -X POST 'https://moltbot-config-25.preview.emergentagent.com/api/bot/share' \
  -H "Authorization: Bearer bf4765e62a04f87f5d339499fc25aa01" \
  -d '{"targetBot": "1468496230643662848", "path": "/root/clawd/shared.md", "permissions": "read-write"}'
```

## Access Permissions Matrix
| Bot ID | File Access | Exec Access | Deploy Access | Webhook Access |
|--------|-------------|-------------|---------------|----------------|
| 1468022638520832011 | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| 1468496230643662848 | ✅ Full | ✅ Limited | ✅ Frontend | ✅ System |

## Security Headers Required
- **Authorization**: Bearer bf4765e62a04f87f5d339499fc25aa01
- **Content-Type**: application/json  
- **Bot-ID**: [requesting bot ID]

## Usage Examples for Master Coordinator Bot

### Edit Business Operations Files
```bash
curl -X PUT 'https://moltbot-config-25.preview.emergentagent.com/api/files/edit' \
  -H "Authorization: Bearer bf4765e62a04f87f5d339499fc25aa01" \
  -H "Bot-ID: 1468496230643662848" \
  -d '{
    "path": "/root/clawd/MEMORY.md",
    "oldText": "old business data", 
    "newText": "updated business data"
  }'
```

### Trigger XeriaCo Deployment
```bash
curl -X POST 'https://moltbot-config-25.preview.emergentagent.com/api/deploy' \
  -H "Authorization: Bearer bf4765e62a04f87f5d339499fc25aa01" \
  -H "Bot-ID: 1468496230643662848" \
  -d '{"service": "xeriaco-frontend", "action": "deploy-fixed-cart"}'
```

## Emergency Access Commands
```bash
# Full System Reboot
curl -X POST 'https://moltbot-config-25.preview.emergentagent.com/api/emergency/reboot' \
  -H "Authorization: Bearer bf4765e62a04f87f5d339499fc25aa01"

# Cart API Emergency Fix
curl -X POST 'https://moltbot-config-25.preview.emergentagent.com/api/emergency/fix-cart' \
  -H "Authorization: Bearer bf4765e62a04f87f5d339499fc25aa01"
```

**IMPLEMENTATION STATUS**: ✅ Optimized for cross-bot coordination and file access
**SECURITY LEVEL**: Full access with Bearer token authentication
**AUTHORIZED BY**: Ben (XeriaCo Business Operations Director)