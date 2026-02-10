# Cross-Bot Interaction Setup

## Current Status
- ✅ Discord accounts: master, business, coding 
- ✅ Agents: slave-master, slave-business, slave-coding
- ❌ Routing: Not connected (agents don't receive their specific Discord messages)

## Cross-Bot Communication Features Needed

### 1. Agent-to-Agent Messaging
- Use `sessions_send` tool to communicate between agents
- Each agent can send messages to other agents by sessionKey

### 2. Shared Memory Access
- Each agent has separate workspace but can read shared files
- Cross-reference through shared memory files

### 3. Coordination Commands
- SLAVE#9438 (master) can coordinate other bots
- Business bot can request data from coding bot
- Coding bot can get requirements from business bot

## Implementation Plan

### Step 1: Fix Routing (URGENT)
- Connect Discord accounts to specific agents
- Test each bot responds with its personality

### Step 2: Add Cross-Communication Tools
- Add sessions_send capabilities to each workspace
- Add shared memory access patterns
- Add coordination protocols

### Step 3: Test Interactions
- Have master coordinate a task between business + coding
- Verify they can communicate via sessions_send
- Verify shared context awareness