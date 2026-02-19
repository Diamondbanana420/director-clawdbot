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

Add whatever helps you do your job. This is your cheat sheet.

## Discord File Attachments

You can upload files as attachments to Discord messages. This is configured and ready to use.

### How to Send File Attachments

Use the `message` tool with action `send` and include a file path:

- **Single file**: Use the `path` parameter with a local file path
- **Max size**: 25 MB per file (configured via mediaMaxMb)
- **Supported**: Images, documents, text files, code files, PDFs, archives, audio, video

### Examples

Send a file from workspace:
```
message(action="send", channel="discord", message="Here's the report", path="/root/clawd/some-file.txt")
```

Send an image:
```
message(action="send", channel="discord", message="Screenshot attached", path="/tmp/screenshot.png")
```

Send to a specific channel:
```
message(action="send", channel="discord", to="channel:CHANNEL_ID", message="File for this channel", path="/root/clawd/data.json")
```

### Tips
- First write/create the file in workspace, then send it with the message tool
- For code output or logs, write to a .txt or .md file first, then attach
- Images from browser screenshots or generated content can be attached directly
- Use `exec` tool to create files, then `message` tool to send them
- Discord supports previews for images, videos, and some document types
