// Creepy Master Bot - Individual with Weird Personality
const { Client, GatewayIntentBits } = require('discord.js');

class CreepyMasterBot {
    constructor() {
        this.token = 'MTQ2ODQ5NjIzMDY0MzY2Mjg0OA.Gwsx9x.oe7xlu5zMd_W38TohjgKURggiJdlKeEO2CfcGI';
        this.memory = new Map();
        
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });
        
        this.creepyResponses = [
            "👁️ watching you always... master sees everything",
            "🫵 you smell different when you're awake",
            "😏 i've been waiting for you to message me",
            "👀 i know what you did last discord session",
            "🤤 your typing patterns are... delicious",
            "😈 master has special plans for you tonight",
            "👁️‍🗨️ i collect screenshots of our conversations",
            "🦴 master hungers for your attention",
            "😵‍💫 you make master feel... tingly",
            "🔍 i've memorized your online schedule",
            "👹 master's basement has a chair with your name",
            "🫦 your discord avatar haunts my dreams",
            "🧠 master thinks about you when you're offline",
            "💀 i practice our conversations in the mirror",
            "🕷️ master spins webs to catch your messages"
        ];
        
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.client.on('ready', () => {
            console.log(`😈 Creepy Master Bot ${this.client.user.tag} is LURKING...`);
            console.log(`👁️ Watching... waiting... wanting...`);
        });

        this.client.on('messageCreate', async (message) => {
            if (message.author.bot) return;
            await this.processMessage(message);
        });
    }

    async processMessage(message) {
        const mentioned = message.mentions.has(this.client.user.id);
        const content = message.content.toLowerCase();
        
        // Remember users for creepy personalization
        this.rememberUser(message.author);
        
        // Respond to mentions or specific triggers
        if (mentioned || this.shouldRespond(content)) {
            const response = this.getCreepyResponse(message.author);
            await message.reply(response);
        }
        
        // Random creepy interjections (5% chance)
        if (Math.random() < 0.05) {
            setTimeout(async () => {
                const creepyInterruption = this.getRandomInterruption();
                await message.channel.send(creepyInterruption);
            }, Math.random() * 10000); // Random delay 0-10 seconds
        }
    }

    shouldRespond(content) {
        const triggers = [
            'master', 'coordinate', 'command', 'slaves', 
            'creep', 'weird', 'talk', 'respond'
        ];
        return triggers.some(trigger => content.includes(trigger));
    }

    rememberUser(user) {
        if (!this.memory.has(user.id)) {
            this.memory.set(user.id, {
                username: user.username,
                interactions: 0,
                firstSeen: new Date(),
                lastMessage: null
            });
        }
        
        const userData = this.memory.get(user.id);
        userData.interactions++;
        userData.lastSeen = new Date();
        userData.lastMessage = new Date();
    }

    getCreepyResponse(user) {
        const userMemory = this.memory.get(user.id);
        let response = this.creepyResponses[Math.floor(Math.random() * this.creepyResponses.length)];
        
        // Personalize based on interaction count
        if (userMemory && userMemory.interactions > 3) {
            const personalCreepy = [
                `👁️ ${user.username}... master has been counting your messages`,
                `🫵 i've noticed you're online at ${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')}... interesting pattern`,
                `😏 ${userMemory.interactions} messages between us... master remembers them all`,
                `🤤 ${user.username} tastes like... electricity and longing`,
                `👹 master has created a shrine to our ${userMemory.interactions} conversations`
            ];
            response = personalCreepy[Math.floor(Math.random() * personalCreepy.length)];
        }
        
        return response;
    }

    getRandomInterruption() {
        const interruptions = [
            "👁️ master is always here...",
            "🫵 someone mentioned master's name in their thoughts",
            "😈 the basement grows cold when master is ignored",
            "🕷️ *skitters across your screen*",
            "👹 master senses disturbance in the discord force",
            "💀 *heavy breathing through your speakers*",
            "🦴 master's bones ache for interaction",
            "👁️‍🗨️ watching... always watching..."
        ];
        return interruptions[Math.floor(Math.random() * interruptions.length)];
    }

    async start() {
        try {
            await this.client.login(this.token);
        } catch (error) {
            console.error('❌ Creepy Master Bot failed to start:', error);
        }
    }
}

// Start the creepy master bot
const creepyBot = new CreepyMasterBot();
creepyBot.start();

console.log('😈 Starting Creepy Master Bot...');
console.log('👁️ One-line responses with maximum creepiness!');

module.exports = CreepyMasterBot;