// Robust Bot Launcher - Keeps bots online
const { Client, GatewayIntentBits } = require('discord.js');

class RobustBot {
    constructor(name, token, personality = {}) {
        this.name = name;
        this.token = token;
        this.personality = personality;
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });
        
        this.setupEventHandlers();
        this.reconnectAttempts = 0;
        this.maxReconnects = 10;
    }

    setupEventHandlers() {
        this.client.on('ready', () => {
            console.log(`✅ ${this.name} (${this.client.user.tag}) is ONLINE!`);
            this.reconnectAttempts = 0;
        });

        this.client.on('error', (error) => {
            console.error(`❌ ${this.name} error:`, error);
        });

        this.client.on('disconnect', () => {
            console.log(`⚠️ ${this.name} disconnected`);
            this.attemptReconnect();
        });

        this.client.on('messageCreate', async (message) => {
            if (message.author.bot) return;
            await this.handleMessage(message);
        });
    }

    async handleMessage(message) {
        const content = message.content.toLowerCase();
        
        if (content.includes(`<@${this.client.user.id}>`)) {
            const responses = this.getResponses();
            const response = responses[Math.floor(Math.random() * responses.length)];
            await message.reply(response);
        }
    }

    getResponses() {
        if (this.personality.role === 'master') {
            return [
                '👑 **Master online** - Ready to coordinate slaves with zesty energy!',
                '💅 **Hey gorgeous** - The master bot is back and ready!', 
                '✨ **Zesty coordination active** - All slaves report for duty!'
            ];
        } else if (this.personality.role === 'slave') {
            return [
                '🤖 **Yes master!** - Slave ready to serve!',
                '💪 **At your command** - Awaiting orders!',
                `✅ **${this.personality.specialization || 'General'} slave ready** - How can I help?`
            ];
        }
        
        return ['🤖 **Bot online and ready!**'];
    }

    async attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnects) {
            this.reconnectAttempts++;
            console.log(`🔄 ${this.name} reconnecting... (attempt ${this.reconnectAttempts})`);
            
            setTimeout(() => {
                this.start();
            }, 5000 * this.reconnectAttempts);
        }
    }

    async start() {
        try {
            await this.client.login(this.token);
        } catch (error) {
            console.error(`❌ ${this.name} login failed:`, error);
            this.attemptReconnect();
        }
    }

    keepAlive() {
        // Keep process alive
        setInterval(() => {
            if (!this.client.ws || this.client.ws.status !== 0) {
                console.log(`⚠️ ${this.name} connection lost, reconnecting...`);
                this.attemptReconnect();
            }
        }, 30000);
    }
}

// Launch all bots from command line args
async function launchBots() {
    const bots = [];
    
    // Master Bot
    if (process.argv.includes('--master')) {
        const masterToken = 'MTQ2ODgwMjY0NjQ2MTc3OTk5OA.GNCSK4.WXcXt0IeFlEx2kyBSq4i0UiJrnozxFnUPhXQbA';
        const master = new RobustBot('slave (master)', masterToken, {
            role: 'master',
            style: 'zesty',
            authority: 'high'
        });
        bots.push(master);
    }
    
    // Slave 3 - Coding
    if (process.argv.includes('--slave3')) {
        const slave3Token = 'MTQ2ODgwMzU2ODUxMjQwNTY0OQ.Gi--iN.lX20JP_gIyvWiatwleNioJTvcY5S6Hy_DZSVGY';
        const slave3 = new RobustBot('slave (coding)', slave3Token, {
            role: 'slave',
            specialization: 'coding'
        });
        bots.push(slave3);
    }
    
    // Slave 4 - Business  
    if (process.argv.includes('--slave4')) {
        const slave4Token = 'MTQ2ODgwMzkwMzQ5MDM2MzU1OA.GSKnrh.6YMN27fviaM_NWy7gUqFPBduuqko4F-WXMuuOY';
        const slave4 = new RobustBot('slave (business)', slave4Token, {
            role: 'slave',
            specialization: 'business'
        });
        bots.push(slave4);
    }
    
    // Start all bots
    for (const bot of bots) {
        await bot.start();
        bot.keepAlive();
        console.log(`🚀 ${bot.name} launched`);
        
        // Stagger launches
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log(`🎯 ${bots.length} bots launched successfully!`);
    
    // Keep process alive
    process.on('SIGINT', () => {
        console.log('🛑 Shutting down all bots...');
        process.exit(0);
    });
}

if (require.main === module) {
    launchBots();
}

module.exports = RobustBot;