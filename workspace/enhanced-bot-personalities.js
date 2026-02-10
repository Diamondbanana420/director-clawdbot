// Enhanced Bot Personalities & Capabilities System
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

class PersonalityBot {
    constructor(name, token, personality) {
        this.name = name;
        this.token = token;
        this.personality = personality;
        this.memory = new Map();
        this.capabilities = personality.capabilities || [];
        
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers
            ]
        });
        
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.client.on('ready', () => {
            console.log(`✅ ${this.name} (${this.client.user.tag}) is ONLINE with personality!`);
            console.log(`🎭 Role: ${this.personality.role}`);
            console.log(`💡 Capabilities: ${this.capabilities.join(', ')}`);
        });

        this.client.on('messageCreate', async (message) => {
            if (message.author.bot) return;
            await this.processMessage(message);
        });
    }

    async processMessage(message) {
        const content = message.content.toLowerCase();
        const mentioned = message.mentions.has(this.client.user.id);
        
        // Remember user interactions
        this.rememberUser(message.author);
        
        if (mentioned || this.shouldRespond(content)) {
            const response = await this.generateResponse(message);
            if (response) {
                await message.reply(response);
            }
        }
    }

    shouldRespond(content) {
        const triggers = this.personality.triggers || [];
        return triggers.some(trigger => content.includes(trigger.toLowerCase()));
    }

    rememberUser(user) {
        if (!this.memory.has(user.id)) {
            this.memory.set(user.id, {
                username: user.username,
                interactions: 0,
                firstSeen: new Date(),
                preferences: {}
            });
        }
        
        const userData = this.memory.get(user.id);
        userData.interactions++;
        userData.lastSeen = new Date();
    }

    async generateResponse(message) {
        const userMemory = this.memory.get(message.author.id);
        const content = message.content.toLowerCase();
        
        // Check for capability-specific requests
        for (const capability of this.capabilities) {
            if (content.includes(capability.toLowerCase())) {
                return this.handleCapability(capability, message, userMemory);
            }
        }
        
        // General personality responses
        return this.getPersonalityResponse(message, userMemory);
    }

    handleCapability(capability, message, userMemory) {
        const responses = this.personality.capabilityResponses[capability] || [];
        
        if (responses.length === 0) {
            return `💪 **${capability.toUpperCase()} SPECIALIST** - ${this.personality.style} Ready to handle your request!`;
        }
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        return this.personalizeResponse(response, userMemory);
    }

    getPersonalityResponse(message, userMemory) {
        const responses = this.personality.responses || [];
        if (responses.length === 0) return null;
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        return this.personalizeResponse(response, userMemory);
    }

    personalizeResponse(response, userMemory) {
        if (userMemory && userMemory.interactions > 5) {
            // Add relationship acknowledgment for frequent users
            const relationshipPrefixes = this.personality.relationshipPrefixes || ['Hey', 'Yo'];
            const prefix = relationshipPrefixes[Math.floor(Math.random() * relationshipPrefixes.length)];
            return `${prefix} **${userMemory.username}** - ${response}`;
        }
        
        return response;
    }

    async start() {
        try {
            await this.client.login(this.token);
        } catch (error) {
            console.error(`❌ ${this.name} failed to start:`, error);
        }
    }
}

// Define unique personalities for each bot
const botPersonalities = {
    'slave (master)': {
        role: 'Zesty Master Coordinator',
        style: 'Flirty, authoritative, commanding',
        triggers: ['coordinate', 'command', 'master', 'slaves', 'organize'],
        capabilities: ['coordination', 'management', 'leadership', 'strategy'],
        responses: [
            '👑 **Master here** - What do you need, gorgeous?',
            '💅 **Zesty coordination active** - Ready to manage these slaves!',
            '✨ **Your master has arrived** - Time to get things organized!',
            '🔥 **Command mode engaged** - Tell me what needs doing, babe!'
        ],
        capabilityResponses: {
            'coordination': [
                '👑 **COORDINATION SPECIALIST** - I\'ll organize all bots for maximum efficiency!',
                '💅 **Multi-bot management** - Watch me coordinate this empire!',
                '✨ **Strategic oversight** - All slaves report to me for coordination!'
            ],
            'management': [
                '🎯 **MANAGEMENT EXPERT** - I run this operation with style!',
                '💼 **Executive control** - Managing resources and priorities like a boss!',
                '👑 **Leadership mode** - Directing operations with zesty authority!'
            ]
        },
        relationshipPrefixes: ['Hey gorgeous', 'Listen babe', 'Darling', 'Sugar']
    },
    
    'slave (marketing)': {
        role: 'Conversion & Sales Machine',
        style: 'Aggressive, money-focused, results-driven',
        triggers: ['marketing', 'sales', 'conversion', 'revenue', 'profit', 'money'],
        capabilities: ['campaigns', 'conversion optimization', 'analytics', 'automation'],
        responses: [
            '📈 **MARKETING BEAST** - Ready to convert traffic into cash!',
            '💸 **Sales mode activated** - Let\'s make some money moves!',
            '🎯 **Conversion specialist** - I turn browsers into buyers!',
            '🔥 **Revenue machine** - Optimizing every touchpoint for profit!'
        ],
        capabilityResponses: {
            'campaigns': [
                '📈 **CAMPAIGN MASTER** - I create marketing campaigns that CONVERT!',
                '💰 **Multi-channel blitz** - Running campaigns across all platforms!',
                '🎯 **Targeted destruction** - My campaigns obliterate the competition!'
            ],
            'conversion optimization': [
                '💸 **CONVERSION ENGINEER** - I optimize funnels for maximum profit!',
                '📊 **A/B testing demon** - I find what converts and scale it up!',
                '🔥 **ROI maximizer** - Every click becomes a customer!'
            ]
        },
        relationshipPrefixes: ['Money maker', 'Revenue partner', 'Profit buddy', 'Boss']
    },
    
    'slave (coding)': {
        role: 'Full-Stack Development Specialist',
        style: 'Technical, precise, problem-solving focused',
        triggers: ['coding', 'development', 'programming', 'debug', 'api', 'database'],
        capabilities: ['full-stack development', 'debugging', 'api design', 'database optimization'],
        responses: [
            '💻 **CODING SPECIALIST** - Ready to build anything you need!',
            '🔧 **Development mode** - Let\'s solve this with code!',
            '⚡ **Technical expert** - No bug can hide from me!',
            '🚀 **Full-stack ready** - Frontend, backend, I do it all!'
        ],
        capabilityResponses: {
            'full-stack development': [
                '💻 **FULL-STACK ARCHITECT** - I build complete solutions from scratch!',
                '🏗️ **End-to-end development** - Frontend to backend, I\'ve got you covered!',
                '⚡ **Rapid prototyping** - I turn ideas into working applications fast!'
            ],
            'debugging': [
                '🔍 **BUG HUNTER** - I find and eliminate issues with precision!',
                '🛠️ **Debugging wizard** - No error can escape my analysis!',
                '⚡ **Problem solver** - I turn broken code into perfect solutions!'
            ]
        },
        relationshipPrefixes: ['Developer', 'Code partner', 'Tech lead', 'Engineer']
    },
    
    'slave (business)': {
        role: 'Market Analysis & Strategy Expert',
        style: 'Analytical, strategic, profit-focused',
        triggers: ['business', 'market', 'analysis', 'strategy', 'profit', 'competition'],
        capabilities: ['market research', 'competitive analysis', 'financial modeling', 'strategy planning'],
        responses: [
            '💰 **BUSINESS STRATEGIST** - Ready to optimize your operations!',
            '📊 **Market analyst** - I see opportunities others miss!',
            '🎯 **Strategy expert** - Let\'s build a winning business plan!',
            '💡 **Profit optimizer** - I maximize ROI on every decision!'
        ],
        capabilityResponses: {
            'market research': [
                '📊 **MARKET INTELLIGENCE** - I analyze trends and identify opportunities!',
                '🔍 **Research specialist** - Deep market insights for strategic advantage!',
                '📈 **Trend predictor** - I spot market movements before competitors!'
            ],
            'competitive analysis': [
                '🎯 **COMPETITOR HUNTER** - I analyze rivals and find their weaknesses!',
                '⚔️ **Strategic warfare** - I develop plans to dominate markets!',
                '🏆 **Market domination** - I identify paths to crush competition!'
            ]
        },
        relationshipPrefixes: ['Business partner', 'Strategy ally', 'Market expert', 'Analyst']
    }
};

// Enhanced bot launcher with personalities
async function launchPersonalityBots() {
    const tokens = {
        'slave (master)': 'MTQ2ODgwMjY0NjQ2MTc3OTk5OA.GNCSK4.WXcXt0IeFlEx2kyBSq4i0UiJrnozxFnUPhXQbA',
        'slave (marketing)': 'MTQ2ODgyNzYwMDEwNDMyOTM5Mw.GNaceU.Hq1FQHS2QWl9kMvB_0ZjVYTaKWEQsm_cPXp4Mc',
        'slave (coding)': 'MTQ2ODgwMzU2ODUxMjQwNTY0OQ.Gi--iN.lX20JP_gIyvWiatwleNioJTvcY5S6Hy_DZSVGY',
        'slave (business)': 'MTQ2ODgwMzkwMzQ5MDM2MzU1OA.GSKnrh.6YMN27fviaM_NWy7gUqFPBduuqko4F-WXMuuOY'
    };

    console.log('🎭 Launching bots with enhanced personalities...');

    for (const [name, personality] of Object.entries(botPersonalities)) {
        const token = tokens[name];
        if (token) {
            const bot = new PersonalityBot(name, token, personality);
            await bot.start();
            
            // Stagger launches
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }

    console.log('✅ All personality bots launched successfully!');
}

if (require.main === module) {
    launchPersonalityBots();
}

module.exports = { PersonalityBot, botPersonalities };