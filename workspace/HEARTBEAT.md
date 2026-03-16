# HEARTBEAT.md - Business Assistant

## Heartbeat Configuration

Every heartbeat cycle, perform a basic health check:

1. **System Status:** Confirm bot is operational and responsive
2. **Memory Check:** Ensure daily memory logs are being written
3. **Connection Status:** Verify Discord connection is active

## Notes
- Keep heartbeat checks lightweight
- Log any issues to daily memory file
- No autonomous actions required - this bot is reactive, not proactive