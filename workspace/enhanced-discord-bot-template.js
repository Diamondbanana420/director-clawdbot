// Enhanced Discord Bot with Memory Persistence
const { Client, GatewayIntentBits } = require('discord.js');
const BotMemorySystem = require('./bot-memory-system');

class EnhancedDiscordBot {
    constructor(botId, personality = {}) {
        this.botId = botId;
        this.memory = new BotMemorySystem(botId);
        
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });
        
        // Load personality from memory or use provided
        this.personality = { ...personality, ...this.memory.memory.personality };
        
        this.setupEventHandlers();
        this.loadStartupContext();
    }

    setupEventHandlers() {
        this.client.on('ready', () => {
            console.log(`🤖 ${this.client.user.tag} is LIVE with memory!`);
            console.log(`📊 Memory: ${this.memory.memory.totalInteractions} interactions, ${Object.keys(this.memory.memory.relationships).length} users known`);
            
            this.memory.rememberContext('lastStartup', new Date().toISOString());
            this.sendStartupMessage();
        });

        this.client.on('messageCreate', async (message) => {
            if (message.author.bot) return;
            
            // Remember this interaction
            this.memory.rememberUser(message.author.id, {
                username: message.author.username,
                lastMessage: message.content
            });
            
            this.memory.rememberConversation(message.channel.id, {
                userId: message.author.id,
                username: message.author.username,
                content: message.content,
                messageId: message.id
            });
            
            // Process message with context
            await this.handleMessageWithContext(message);
        });
    }

    loadStartupContext() {
        const context = this.memory.getStartupContext();
        console.log('🧠 Loading memory context:', {
            totalInteractions: context.memory.totalInteractions,
            totalUsers: context.totalUsers,
            totalChannels: context.totalChannels,
            lastActive: context.memory.lastActive
        });
    }

    async sendStartupMessage() {
        // Find main channel and announce restart with memory
        const mainChannelId = '1467990957629640850';
        try {
            const channel = await this.client.channels.fetch(mainChannelId);
            if (channel) {
                const context = this.memory.getStartupContext();
                await channel.send(`🧠 **MEMORY RESTORED** 
${this.botId} back online with full memory!
📊 **Remembered**: ${context.totalUsers} users, ${context.memory.totalInteractions} interactions
⚡ **Status**: All previous context and relationships intact
💸 **Ready**: Continuing where we left off!`);
            }
        } catch (error) {
            console.log('Could not send startup message');
        }
    }

    async handleMessageWithContext(message) {
        // Get user context
        const userContext = this.memory.getUserContext(message.author.id);
        const channelHistory = this.memory.getChannelHistory(message.channel.id, 5);
        
        // Enhanced response with memory
        const content = message.content.toLowerCase();
        
        if (content.includes('@' + this.client.user.id) || this.shouldRespond(content, userContext)) {
            const response = await this.generateContextualResponse(message, userContext, channelHistory);
            if (response) {
                await message.reply(response);
            }
        }
    }

    shouldRespond(content, userContext) {
        // Custom logic based on personality and user history
        const keywords = this.getPersonalityKeywords();
        return keywords.some(keyword => content.includes(keyword));
    }

    getPersonalityKeywords() {
        // Override in subclasses for specific bot personalities
        return ['bot', 'help', 'status', 'money', 'profit'];
    }

    async generateContextualResponse(message, userContext, channelHistory) {
        // Override in subclasses for specific responses
        const greetings = [
            '🤖 **MEMORY INTACT** - I remember you!',
            '💡 **CONTEXT LOADED** - Ready to continue!',
            '🧠 **FULL RECALL** - Previous conversations remembered!'
        ];
        
        if (userContext && userContext.interactions > 1) {
            return greetings[Math.floor(Math.random() * greetings.length)];
        }
        
        return '🤖 **NEW USER DETECTED** - Nice to meet you! I\'ll remember our conversation.';
    }

    // Save important state before shutdown
    async shutdown() {
        console.log('💾 Saving final memory state...');
        this.memory.saveMemory();
        this.memory.saveConversations();
        await this.client.destroy();
    }

    async login(token) {
        // Set up graceful shutdown
        process.on('SIGINT', () => this.shutdown());
        process.on('SIGTERM', () => this.shutdown());
        
        try {
            await this.client.login(token);
        } catch (error) {
            console.error('Login error:', error);
            process.exit(1);
        }
    }
}

module.exports = EnhancedDiscordBot;