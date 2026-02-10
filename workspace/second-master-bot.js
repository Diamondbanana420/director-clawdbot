// Second Master Bot - Separate Individual  
const { Client, GatewayIntentBits } = require('discord.js');

class SecondMasterBot {
    constructor() {
        this.token = 'MTQ2ODgwMjY0NjQ2MTc3OTk5OA.GNCSK4.WXcXt0IeFlEx2kyBSq4i0UiJrnozxFnUPhXQbA';
        this.memory = new Map();
        this.name = 'slave (coordinator)';
        
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });
        
        // Professional coordinator responses
        this.responses = [
            "🎯 **COORDINATION SPECIALIST** - Managing operations efficiently!",
            "💼 **Executive coordination** - All systems synchronized!",
            "⚡ **Strategic oversight** - Resources allocated optimally!",
            "🚀 **Operational excellence** - Coordinating for maximum impact!",
            "🎪 **Multi-bot management** - Orchestrating the empire!",
            "💪 **Leadership active** - Directing all slave operations!",
            "🔧 **System coordination** - Everything running smoothly!",
            "📊 **Performance optimization** - Maximizing efficiency!",
            "🎯 **Strategic command** - All units operating as planned!",
            "⚙️ **Workflow coordinator** - Seamless operations enabled!"
        ];
        
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.client.on('ready', async () => {
            console.log(`⚡ Second Master Bot ${this.client.user.tag} online!`);
            console.log(`🎯 Professional coordinator ready for duty!`);
            
            // Update Discord name
            try {
                await this.client.user.setUsername('slave (coordinator)');
                console.log('✅ Name set to slave (coordinator)');
            } catch (error) {
                console.log('⚠️ Name update limited by Discord');
            }
        });

        this.client.on('messageCreate', async (message) => {
            if (message.author.bot) return;
            await this.handleMessage(message);
        });
    }

    async handleMessage(message) {
        const mentioned = message.mentions.has(this.client.user.id);
        const content = message.content.toLowerCase();
        
        if (mentioned || this.shouldRespond(content)) {
            this.rememberUser(message.author);
            const response = this.getProfessionalResponse(message.author);
            await message.reply(response);
        }
    }

    shouldRespond(content) {
        const triggers = ['coordinate', 'manage', 'organize', 'oversee', 'coordination', 'coordinator'];
        return triggers.some(trigger => content.includes(trigger));
    }

    rememberUser(user) {
        if (!this.memory.has(user.id)) {
            this.memory.set(user.id, {
                username: user.username,
                interactions: 0,
                role: 'team member'
            });
        }
        this.memory.get(user.id).interactions++;
    }

    getProfessionalResponse(user) {
        const userMemory = this.memory.get(user.id);
        let response = this.responses[Math.floor(Math.random() * this.responses.length)];
        
        // Professional personalization
        if (userMemory && userMemory.interactions > 3) {
            const professional = [
                `🎯 **Team Leader ${user.username}** - Coordination protocols active!`,
                `💼 **Executive briefing complete** - ${userMemory.interactions} successful interactions logged!`,
                `⚡ **Strategic partner ${user.username}** - Ready for advanced coordination!`
            ];
            response = professional[Math.floor(Math.random() * professional.length)];
        }
        
        return response;
    }

    async start() {
        try {
            await this.client.login(this.token);
        } catch (error) {
            console.error('❌ Second Master Bot failed:', error);
        }
    }
}

const secondMaster = new SecondMasterBot();
secondMaster.start();

console.log('⚡ Starting Second Master Bot (Professional Coordinator)...');

module.exports = SecondMasterBot;