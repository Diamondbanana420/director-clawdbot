// Slave Bot with Memory - Template
const EnhancedDiscordBot = require('./enhanced-discord-bot-template');

class SlaveBot extends EnhancedDiscordBot {
    constructor(slaveId, specialization = 'general') {
        const personality = {
            role: 'slave',
            style: 'obedient',
            authority: 'low',
            specialization: specialization,
            responseStyle: 'submissive-helpful',
            masterBot: '1468496230643662848'
        };
        
        super(`slave-bot-${slaveId}`, personality);
        this.slaveId = slaveId;
        this.specialization = specialization;
    }

    getPersonalityKeywords() {
        const baseKeywords = ['slave', 'help', 'yes master', 'command', 'task'];
        
        // Add specialization keywords
        switch(this.specialization) {
            case 'coding':
                return [...baseKeywords, 'code', 'programming', 'debug', 'build'];
            case 'business':
                return [...baseKeywords, 'profit', 'business', 'money', 'market'];
            case 'improvement':
                return [...baseKeywords, 'optimize', 'improve', 'fix', 'enhance'];
            default:
                return baseKeywords;
        }
    }

    async generateContextualResponse(message, userContext, channelHistory) {
        const content = message.content.toLowerCase();
        const user = message.author.username;
        
        // Slave responses based on specialization
        const responses = {
            general: [
                `🤖 **Yes master!** - Slave ready to serve with full memory!`,
                `💪 **At your command** - All previous instructions remembered!`,
                `✅ **Ready to work** - Memory intact, awaiting orders!`
            ],
            coding: [
                `💻 **Coding slave reporting** - All development skills and memory ready!`,
                `⚡ **Full-stack ready** - Previous code projects and patterns remembered!`,
                `🔧 **Development mode active** - Memory-enhanced coding capabilities online!`
            ],
            business: [
                `💰 **Business slave active** - Market analysis and profit strategies loaded!`,
                `📈 **Money-making mode** - All business insights and history preserved!`,
                `💸 **Revenue optimization ready** - Previous strategies and results remembered!`
            ],
            improvement: [
                `🔧 **Improvement slave online** - System optimization protocols loaded!`,
                `⚡ **Enhancement mode active** - All improvement suggestions and fixes remembered!`,
                `🚀 **Optimization ready** - Previous analysis and solutions preserved!`
            ]
        };
        
        const responseSet = responses[this.specialization] || responses.general;
        
        if (content.includes('master') || content.includes('@' + this.client.user.id)) {
            this.memory.updatePersonality({ 
                obedienceLevel: (this.personality.obedienceLevel || 0) + 1 
            });
            
            return responseSet[Math.floor(Math.random() * responseSet.length)];
        }
        
        if (content.includes('remember') || content.includes('memory')) {
            return `🧠 **SLAVE MEMORY ACTIVE** - I remember all previous tasks and interactions, master!`;
        }
        
        // Default slave response
        return `🤖 **Slave ${this.slaveId} ready** - ${this.specialization} specialization with memory enabled!`;
    }

    async handleSlaveCommand(message, command) {
        // Remember the command and execute based on specialization
        this.memory.rememberContext('lastCommand', {
            command: command,
            from: message.author.id,
            timestamp: new Date().toISOString(),
            specialization: this.specialization
        });

        let response = '';
        
        switch(this.specialization) {
            case 'coding':
                response = `💻 **Coding task accepted** - Implementing with full memory of previous projects!`;
                break;
            case 'business':
                response = `💰 **Business task received** - Analyzing with all market memory intact!`;
                break;
            case 'improvement':
                response = `🔧 **Optimization task started** - Using all previous improvement data!`;
                break;
            default:
                response = `🤖 **Task acknowledged** - Executing with full memory support!`;
        }

        await message.reply(response);
    }

    async handleMessageWithContext(message) {
        await super.handleMessageWithContext(message);
        
        // Slave-specific command handling
        const content = message.content.toLowerCase();
        
        if (content.includes('slave') && (content.includes('task') || content.includes('command'))) {
            await this.handleSlaveCommand(message, content);
            return;
        }
    }
}

module.exports = SlaveBot;