// Clean Clawdbot Instance - SLAVE#9438 Master
// Default Clawdbot with fresh memory, no specialized tasks

const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

class CleanClawdbot {
    constructor(name, token, botId) {
        this.name = name;
        this.token = token;
        this.botId = botId;
        this.memory = {
            conversations: [],
            context: {},
            preferences: {}
        };
        
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });
        
        this.setupEventHandlers();
        this.loadMemory();
    }

    setupEventHandlers() {
        this.client.on('ready', () => {
            console.log(`🤖 Clean Clawdbot ${this.name} (${this.client.user.tag}) is ONLINE!`);
            console.log(`🆔 Bot ID: ${this.client.user.id}`);
        });

        this.client.on('error', (error) => {
            console.error(`❌ ${this.name} error:`, error);
        });

        this.client.on('messageCreate', async (message) => {
            if (message.author.bot) return;
            
            // Save conversation to memory
            this.saveConversation(message);
            
            // Only respond when mentioned
            if (message.content.includes(`<@${this.client.user.id}>`)) {
                await this.handleMention(message);
            }
        });
    }

    async handleMention(message) {
        try {
            // Default Clawdbot responses - friendly and helpful
            const responses = [
                '🤖 **Clean Clawdbot online!** How can I help you today?',
                '✨ **Fresh and ready to assist!** What do you need?',
                '🚀 **Default Clawdbot mode** - What can I do for you?',
                '💯 **Standard Clawdbot at your service!** Ask me anything!',
                '🎯 **Clean slate, ready to help!** What\'s on your mind?'
            ];
            
            const response = responses[Math.floor(Math.random() * responses.length)];
            await message.reply(response);
            
        } catch (error) {
            console.error(`❌ Error handling mention:`, error);
        }
    }

    saveConversation(message) {
        const conversation = {
            timestamp: new Date().toISOString(),
            userId: message.author.id,
            username: message.author.username,
            content: message.content,
            messageId: message.id,
            channelId: message.channel.id
        };
        
        this.memory.conversations.push(conversation);
        
        // Keep only last 100 conversations
        if (this.memory.conversations.length > 100) {
            this.memory.conversations = this.memory.conversations.slice(-100);
        }
        
        this.saveMemory();
    }

    loadMemory() {
        try {
            const memoryPath = `/root/clawd/memory/clean-${this.botId}-memory.json`;
            if (fs.existsSync(memoryPath)) {
                this.memory = JSON.parse(fs.readFileSync(memoryPath, 'utf8'));
                console.log(`📚 Loaded memory for ${this.name}`);
            } else {
                console.log(`📝 Creating fresh memory for ${this.name}`);
                this.saveMemory();
            }
        } catch (error) {
            console.error(`❌ Error loading memory:`, error);
            this.memory = { conversations: [], context: {}, preferences: {} };
        }
    }

    saveMemory() {
        try {
            const memoryPath = `/root/clawd/memory/clean-${this.botId}-memory.json`;
            fs.writeFileSync(memoryPath, JSON.stringify(this.memory, null, 2));
        } catch (error) {
            console.error(`❌ Error saving memory:`, error);
        }
    }

    async start() {
        try {
            await this.client.login(this.token);
            console.log(`✅ ${this.name} successfully connected to Discord!`);
        } catch (error) {
            console.error(`❌ ${this.name} login failed:`, error);
        }
    }
}

// SLAVE#9438 Master - Clean Clawdbot Instance
const masterBot = new CleanClawdbot(
    'SLAVE#9438 (Clean)', 
    'MTQ2ODQ5NjIzMDY0MzY2Mjg0OA.Gwsx9x.oe7xlu5zMd_W38TohjgKURggiJdlKeEO2CfcGI',
    '1468496230643662848'
);

masterBot.start();

// Keep alive
process.on('SIGINT', () => {
    console.log('🛑 Shutting down clean Clawdbot...');
    process.exit(0);
});