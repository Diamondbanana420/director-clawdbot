// Master Slave Bot with Full Memory Persistence
const EnhancedDiscordBot = require('./enhanced-discord-bot-template');

class MasterSlaveBot extends EnhancedDiscordBot {
    constructor() {
        const personality = {
            role: 'master',
            style: 'zesty',
            authority: 'high',
            manages: ['slaves', 'coordination', 'tasks'],
            responseStyle: 'flirty-confident'
        };
        
        super('master-slave-bot', personality);
        
        // Master-specific memory
        this.slaves = new Map();
        this.loadSlaveMemory();
    }

    loadSlaveMemory() {
        const slaveData = this.memory.getContext('knownSlaves');
        if (slaveData) {
            this.slaves = new Map(Object.entries(slaveData));
            console.log(`👑 Remembered ${this.slaves.size} slave bots`);
        }
    }

    saveSlaveMemory() {
        this.memory.rememberContext('knownSlaves', Object.fromEntries(this.slaves));
    }

    getPersonalityKeywords() {
        return ['master', 'slave', 'bot', 'command', 'zesty', 'help', 'manage', 'coordinate'];
    }

    async generateContextualResponse(message, userContext, channelHistory) {
        const content = message.content.toLowerCase();
        const user = message.author.username;
        
        // Remember user's role and preferences
        if (userContext) {
            const interactions = userContext.interactions;
            
            if (content.includes('slave')) {
                this.memory.updatePersonality({ 
                    dominanceLevel: (this.personality.dominanceLevel || 0) + 1 
                });
                
                const responses = [
                    `💅 **Master remembers you, ${user}** - Ready to manage the slaves again!`,
                    `👑 **Welcome back** - I've kept all our slave bots in line while you were away!`,
                    `✨ **Memory fully loaded** - Previous commands and slave status restored!`
                ];
                return responses[Math.floor(Math.random() * responses.length)];
            }
            
            if (content.includes('remember') || content.includes('memory')) {
                return `🧠 **PERFECT RECALL** - I remember everything: ${interactions} interactions, your preferences, all our conversations. Nothing lost!`;
            }
            
            if (content.includes('bots') || content.includes('coordinate')) {
                return `👑 **SLAVE COORDINATION ACTIVE** - All bot memories preserved, ready to manage the empire!`;
            }
        }
        
        // Zesty personality responses
        const zestyResponses = [
            `💅 **Hey gorgeous** - Master's back with full memory intact!`,
            `✨ **Missed me?** - I remembered every detail while you were gone!`,
            `👑 **Master's home** - Time to get these slaves working again!`
        ];
        
        return zestyResponses[Math.floor(Math.random() * zestyResponses.length)];
    }

    async handleSlaveCommand(message, command, args) {
        const slaveId = args[0];
        
        if (!this.slaves.has(slaveId)) {
            this.slaves.set(slaveId, {
                id: slaveId,
                status: 'active',
                lastCommand: command,
                addedBy: message.author.id,
                addedAt: new Date().toISOString()
            });
            this.saveSlaveMemory();
        }
        
        // Update slave status
        const slave = this.slaves.get(slaveId);
        slave.lastCommand = command;
        slave.lastCommandAt = new Date().toISOString();
        this.saveSlaveMemory();
        
        await message.reply(`👑 **Command sent to slave ${slaveId}** - Master's orders are absolute!`);
    }

    async handleMessageWithContext(message) {
        await super.handleMessageWithContext(message);
        
        // Master-specific command handling
        const content = message.content.toLowerCase();
        
        if (content.includes('slave') && content.includes('command')) {
            const args = content.split(' ').slice(1);
            await this.handleSlaveCommand(message, 'command', args);
            return;
        }
        
        if (content.includes('status') && content.includes('slave')) {
            const slaveCount = this.slaves.size;
            await message.reply(`👑 **SLAVE STATUS** - Managing ${slaveCount} slaves. All memories intact!`);
            return;
        }
    }
}

// Get Discord token from environment or args
const token = process.env.MASTER_DISCORD_TOKEN || process.argv[2];

if (!token) {
    console.error('❌ Need Discord token: node master-slave-bot-memory.js <TOKEN>');
    process.exit(1);
}

// Start the master bot with memory
const masterBot = new MasterSlaveBot();
masterBot.login(token);

console.log('👑 Master Slave Bot with Memory starting...');
console.log('💅 Zesty personality with full memory persistence!');
console.log('🧠 All conversations and relationships will be remembered!');