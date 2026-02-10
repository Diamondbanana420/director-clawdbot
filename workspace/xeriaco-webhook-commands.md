# XeriaCo System Webhook Commands

## Reactivation Webhook
```bash
curl -X POST 'https://moltbot-config-25.preview.emergentagent.com/api/webhook' \
  -d '{"action": "reactivate"}'
```

**Purpose:** System reactivation trigger for moltbot services
**Added:** 2026-02-07 06:51 UTC  
**Authorization:** Business Operations Director

## Usage Notes
- Use for system reactivation when needed
- Endpoint: moltbot-config-25.preview.emergentagent.com
- Action: reactivate
- Method: POST with JSON payload

## Related Systems
- Backend: https://xeriaco-backend-production.up.railway.app
- Frontend: https://xeriaco-frontend-production.up.railway.app
- Moltbot: https://moltbot-config-25.preview.emergentagent.com