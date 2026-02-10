# TOOLS.md - Local Notes

Skills define *how* tools work. This file is for *your* specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:
- Camera names and locations
- SSH hosts and aliases  
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras
- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH
- home-server → 192.168.1.100, user: admin

### TTS
- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

## Ben's XeriaCo Setup

### Shopify Store
- **Store**: xeria-378.myshopify.com  
- **Integration**: Need to set up Maton API access for Shopify GraphQL
- **Priority**: Become the bridge between frontend/backend and Shopify

### System Architecture  
- **Frontend**: Netlify (xeriacofinal.vercel.app)
- **Backend**: Emergent server 
- **Me**: Integration bridge for order flow and data sync
- **Shopify**: Handles payments, customers, fulfillment

### Integration Goals
1. **Order Processing**: Frontend orders → Shopify checkout
2. **Product Management**: Sync products between systems
3. **Inventory Updates**: Real-time stock management  
4. **Customer Experience**: Seamless purchasing flow

---

Add whatever helps you do your job. This is your cheat sheet.
