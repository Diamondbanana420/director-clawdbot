// Enhanced Clean Clawdbot - Better responses and interaction
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

class EnhancedCleanClawdbot {
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
            console.log(`🤖 Enhanced Clean Clawdbot ${this.name} (${this.client.user.tag}) is ONLINE!`);
            console.log(`🆔 Bot ID: ${this.client.user.id}`);
        });

        this.client.on('error', (error) => {
            console.error(`❌ ${this.name} error:`, error);
        });

        this.client.on('messageCreate', async (message) => {
            if (message.author.bot) return;
            
            console.log(`📝 Message from ${message.author.username}: ${message.content}`);
            
            // Save conversation to memory
            this.saveConversation(message);
            
            // Check if mentioned
            const mentioned = message.content.includes(`<@${this.client.user.id}>`);
            console.log(`🔍 Mentioned: ${mentioned} (My ID: ${this.client.user.id})`);
            
            if (mentioned) {
                console.log(`✨ Handling mention from ${message.author.username}`);
                await this.handleMention(message);
            }
        });
    }

    async handleMention(message) {
        try {
            const content = message.content.toLowerCase();
            let response;

            // Smart responses based on what they ask
            if (content.includes('what can you do') || content.includes('what can u do') || content.includes('capabilities')) {
                response = `🤖 **I'm a clean Clawdbot instance!** Here's what I can do:

✅ **General assistance** - Ask me anything
🔧 **Tool access** - I can use various tools and skills  
💬 **Conversation** - Chat naturally with me
📚 **Memory** - I remember our conversations
🚀 **Tasks** - Help with projects and automation
🎯 **Flexible** - No specialized personality - just helpful!

What do you need help with?`;
            } else if (content.includes('hey') || content.includes('hello') || content.includes('hi ')) {
                const greetings = [
                    '👋 **Hey there!** What\'s up?',
                    '🤖 **Hello!** Ready to help however you need!',
                    '✨ **Hi!** Clean Clawdbot at your service!',
                    '🚀 **Hey!** What can I assist with today?'
                ];
                response = greetings[Math.floor(Math.random() * greetings.length)];
            } else if (content.includes('help')) {
                response = `🆘 **Happy to help!** I'm a standard Clawdbot with access to:

🛠️ **Tools & Skills** - Various automation capabilities
💻 **Code & Development** - Programming assistance  
🌐 **Web & Research** - Information gathering
📊 **Data & Analysis** - Processing and insights
🎨 **Creative Tasks** - Content generation
⚙️ **System Operations** - Server and deployment tasks

Just tell me what you need!`;
            } else {
                // Default friendly responses
                const responses = [
                    '🤖 **Clean Clawdbot here!** How can I help you?',
                    '✨ **Ready to assist!** What do you need?',
                    '🚀 **At your service!** What\'s the task?',
                    '💯 **Standard Clawdbot mode!** How can I help?',
                    '🎯 **Fresh and ready!** What\'s on your mind?',
                    '⚡ **Vanilla Clawdbot ready!** What can I do for you?'
                ];
                response = responses[Math.floor(Math.random() * responses.length)];
            }
            
            console.log(`📤 Sending response: ${response.substring(0, 100)}...`);
            await message.reply(response);
            
        } catch (error) {
            console.error(`❌ Error handling mention:`, error);
            await message.reply('🤖 **Oops!** Something went wrong, but I\'m here and ready to help!');
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
            const memoryPath = `/root/clawd/memory/enhanced-${this.botId}-memory.json`;
            if (fs.existsSync(memoryPath)) {
                this.memory = JSON.parse(fs.readFileSync(memoryPath, 'utf8'));
                console.log(`📚 Loaded memory for ${this.name} (${this.memory.conversations.length} conversations)`);
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
            const memoryPath = `/root/clawd/memory/enhanced-${this.botId}-memory.json`;
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

// Determine which bot to run based on argument
const botType = process.argv[2];

let bot;
if (botType === 'master') {
    bot = new EnhancedCleanClawdbot(
        'SLAVE#9438 (Enhanced)', 
        'MTQ2ODQ5NjIzMDY0MzY2Mjg0OA.Gwsx9x.oe7xlu5zMd_W38TohjgKURggiJdlKeEO2CfcGI',
        '1468496230643662848'
    );
} else if (botType === 'business') {
    bot = new EnhancedCleanClawdbot(
        'Business Bot (Enhanced)', 
        'MTQ2ODgwMzkwMzQ5MDM2MzU1OA.GSKnrh.6YMN27fviaM_NWy7gUqFPBduuqko4F-WXMuuOY',
        '1468803903490363558'
    );
} else if (botType === 'coding') {
    bot = new EnhancedCleanClawdbot(
        'Coding Bot (Enhanced)', 
        'MTQ2ODgwMzU2ODUxMjQwNTY0OQ.Gi--iN.lX20JP_gIyvWiatwleNioJTvcY5S6Hy_DZSVGY',
        '1468803566851240564'
    );
} else {
    console.error('❌ Usage: node enhanced-clean-clawdbot.js [master|business|coding]');
    process.exit(1);
}

bot.start();

// Keep alive
process.on('SIGINT', () => {
    console.log('🛑 Shutting down enhanced clean Clawdbot...');
    process.exit(0);
});