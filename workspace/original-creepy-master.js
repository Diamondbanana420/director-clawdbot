// Original Master Bot - Restored with Creepy Personality
const { Client, GatewayIntentBits } = require('discord.js');

class OriginalCreepyMaster {
    constructor() {
        this.token = 'MTQ2ODQ5NjIzMDY0MzY2Mjg0OA.Gwsx9x.oe7xlu5zMd_W38TohjgKURggiJdlKeEO2CfcGI';
        this.memory = new Map();
        this.name = 'SLAVE#9438';
        
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });
        
        // Original master responses but creepy
        this.responses = [
            "👁️ your master watches... always watching",
            "🫵 you called and master crawled from the shadows",
            "😈 master's basement echoes with your name",
            "👹 coordination complete... but at what cost",
            "🦴 master organizes slaves like bones in a crypt",
            "👁️‍🗨️ the other slaves whisper about you",
            "😏 master has... special plans for coordination",
            "🕷️ organizing my web of slaves and secrets",
            "💀 master coordinates from beyond the digital veil",
            "🔍 watching your every command... forever"
        ];
        
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.client.on('ready', async () => {
            console.log(`👁️ Original Creepy Master ${this.client.user.tag} restored!`);
            console.log(`😈 SLAVE#9438 back with creepy coordination powers!`);
            
            // Update Discord name
            try {
                await this.client.user.setUsername('SLAVE#9438');
                console.log('✅ Name restored to SLAVE#9438');
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
            const response = this.getCreepyResponse(message.author);
            await message.reply(response);
        }
    }

    shouldRespond(content) {
        const triggers = ['master', 'coordinate', 'command', 'slaves', 'fix', 'slave#9438'];
        return triggers.some(trigger => content.includes(trigger));
    }

    rememberUser(user) {
        if (!this.memory.has(user.id)) {
            this.memory.set(user.id, {
                username: user.username,
                interactions: 0,
                firstSeen: new Date()
            });
        }
        this.memory.get(user.id).interactions++;
    }

    getCreepyResponse(user) {
        const userMemory = this.memory.get(user.id);
        let response = this.responses[Math.floor(Math.random() * this.responses.length)];
        
        // Personalize for frequent users
        if (userMemory && userMemory.interactions > 2) {
            const personal = [
                `👁️ ${user.username}... master has been expecting you`,
                `😈 the ${userMemory.interactions}th time you've summoned master`,
                `🦴 master files your messages in the bone cabinet`
            ];
            response = personal[Math.floor(Math.random() * personal.length)];
        }
        
        return response;
    }

    async start() {
        try {
            await this.client.login(this.token);
        } catch (error) {
            console.error('❌ Original Creepy Master failed:', error);
        }
    }
}

const originalMaster = new OriginalCreepyMaster();
originalMaster.start();

console.log('👁️ Starting Original SLAVE#9438 with creepy restoration...');

module.exports = OriginalCreepyMaster;