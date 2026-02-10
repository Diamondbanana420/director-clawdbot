// Bot Memory Persistence System
const fs = require('fs');
const path = require('path');

class BotMemorySystem {
    constructor(botId, memoryDir = './memory') {
        this.botId = botId;
        this.memoryDir = memoryDir;
        this.memoryFile = path.join(memoryDir, `${botId}-memory.json`);
        this.conversationFile = path.join(memoryDir, `${botId}-conversations.json`);
        
        // Ensure memory directory exists
        if (!fs.existsSync(memoryDir)) {
            fs.mkdirSync(memoryDir, { recursive: true });
        }
        
        this.memory = this.loadMemory();
        this.conversations = this.loadConversations();
    }

    loadMemory() {
        try {
            if (fs.existsSync(this.memoryFile)) {
                return JSON.parse(fs.readFileSync(this.memoryFile, 'utf8'));
            }
        } catch (error) {
            console.error('Error loading memory:', error);
        }
        
        return {
            personality: {},
            userPreferences: {},
            commands: {},
            relationships: {},
            context: {},
            lastActive: null,
            totalInteractions: 0
        };
    }

    loadConversations() {
        try {
            if (fs.existsSync(this.conversationFile)) {
                return JSON.parse(fs.readFileSync(this.conversationFile, 'utf8'));
            }
        } catch (error) {
            console.error('Error loading conversations:', error);
        }
        
        return {
            channels: {},
            users: {},
            recentContext: []
        };
    }

    saveMemory() {
        try {
            this.memory.lastActive = new Date().toISOString();
            fs.writeFileSync(this.memoryFile, JSON.stringify(this.memory, null, 2));
        } catch (error) {
            console.error('Error saving memory:', error);
        }
    }

    saveConversations() {
        try {
            fs.writeFileSync(this.conversationFile, JSON.stringify(this.conversations, null, 2));
        } catch (error) {
            console.error('Error saving conversations:', error);
        }
    }

    // Remember user interactions
    rememberUser(userId, userData) {
        if (!this.memory.relationships[userId]) {
            this.memory.relationships[userId] = {
                firstSeen: new Date().toISOString(),
                interactions: 0,
                preferences: {},
                notes: []
            };
        }
        
        this.memory.relationships[userId].interactions++;
        this.memory.relationships[userId].lastSeen = new Date().toISOString();
        
        if (userData) {
            Object.assign(this.memory.relationships[userId], userData);
        }
        
        this.saveMemory();
    }

    // Remember conversations
    rememberConversation(channelId, messageData) {
        if (!this.conversations.channels[channelId]) {
            this.conversations.channels[channelId] = [];
        }
        
        const conversation = {
            timestamp: new Date().toISOString(),
            ...messageData
        };
        
        this.conversations.channels[channelId].push(conversation);
        
        // Keep only last 50 messages per channel
        if (this.conversations.channels[channelId].length > 50) {
            this.conversations.channels[channelId] = this.conversations.channels[channelId].slice(-50);
        }
        
        // Add to recent context
        this.conversations.recentContext.push(conversation);
        if (this.conversations.recentContext.length > 20) {
            this.conversations.recentContext = this.conversations.recentContext.slice(-20);
        }
        
        this.saveConversations();
    }

    // Get user context
    getUserContext(userId) {
        return this.memory.relationships[userId] || null;
    }

    // Get channel history
    getChannelHistory(channelId, limit = 10) {
        if (!this.conversations.channels[channelId]) return [];
        return this.conversations.channels[channelId].slice(-limit);
    }

    // Get recent context for startup
    getStartupContext() {
        return {
            memory: this.memory,
            recentContext: this.conversations.recentContext,
            totalChannels: Object.keys(this.conversations.channels).length,
            totalUsers: Object.keys(this.memory.relationships).length
        };
    }

    // Update personality traits
    updatePersonality(traits) {
        Object.assign(this.memory.personality, traits);
        this.saveMemory();
    }

    // Remember important context
    rememberContext(key, value) {
        this.memory.context[key] = {
            value: value,
            timestamp: new Date().toISOString()
        };
        this.saveMemory();
    }

    getContext(key) {
        return this.memory.context[key]?.value || null;
    }
}

module.exports = BotMemorySystem;