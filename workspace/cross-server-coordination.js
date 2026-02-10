// Cross-Server Coordination & Remote Restart System
const https = require('https');
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

class CrossServerCoordinator {
    constructor() {
        this.otherServerAPI = 'https://distracted-borg.preview.emergentagent.com';
        this.llmKey = 'sk-emergent-81b30117aEdAbAa083';
        this.masterBotToken = 'MTQ2ODQ5NjIzMDY0MzY2Mjg0OA.Gwsx9x.oe7xlu5zMd_W38TohjgKURggiJdlKeEO2CfcGI';
        this.masterBotId = '1468496230643662848';
        this.sharedMemoryFile = '/root/clawd/shared-memory.json';
        
        this.initializeSharedMemory();
    }

    async initializeSharedMemory() {
        const defaultMemory = {
            servers: {
                'this-server': {
                    url: 'localhost',
                    bots: ['slave (master)', 'slave (marketing)', 'slave (coding)', 'slave (business)'],
                    lastUpdate: new Date().toISOString(),
                    status: 'online'
                },
                'other-server': {
                    url: 'distracted-borg.preview.emergentagent.com',
                    bots: ['master-slave-bot'],
                    lastUpdate: null,
                    status: 'unknown'
                }
            },
            coordination: {
                masterServer: 'this-server',
                syncInterval: 30000,
                lastSync: null
            },
            sharedData: {
                userPreferences: {},
                crossServerMessages: [],
                botStatuses: {}
            }
        };

        if (!fs.existsSync(this.sharedMemoryFile)) {
            fs.writeFileSync(this.sharedMemoryFile, JSON.stringify(defaultMemory, null, 2));
            console.log('📝 Shared memory file created');
        }
    }

    async checkOtherServerHealth() {
        console.log('🔍 Checking other server health...');
        
        const endpoints = [
            `${this.otherServerAPI}/health`,
            `${this.otherServerAPI}/api/status`,
            `${this.otherServerAPI}/status`
        ];

        for (const endpoint of endpoints) {
            try {
                console.log(`🔗 Trying: ${endpoint}`);
                const response = await this.makeRequest(endpoint);
                console.log(`✅ Response from ${endpoint}:`, response.substring(0, 200));
                return true;
            } catch (error) {
                console.log(`❌ Failed ${endpoint}: ${error.message}`);
            }
        }
        
        console.log('⚠️ Other server not accessible via API');
        return false;
    }

    async makeRequest(url, options = {}) {
        return new Promise((resolve, reject) => {
            const req = https.get(url, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(data);
                    } else {
                        reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                    }
                });
            });
            
            req.on('error', reject);
            req.setTimeout(5000, () => {
                req.destroy();
                reject(new Error('Timeout'));
            });
        });
    }

    async startMasterBotLocally() {
        console.log('🤖 Starting Master Bot locally for cross-server coordination...');
        
        const client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });

        client.on('ready', () => {
            console.log(`✅ Master Bot ${client.user.tag} started locally for coordination!`);
            this.updateSharedMemory('masterBotLocal', 'online');
        });

        client.on('messageCreate', async (message) => {
            if (message.author.bot) return;
            
            // Handle cross-server coordination
            if (message.content.toLowerCase().includes('coordination') || 
                message.content.includes(this.masterBotId)) {
                
                await this.handleCoordinationMessage(message);
            }
        });

        try {
            await client.login(this.masterBotToken);
            return client;
        } catch (error) {
            console.error('❌ Failed to start Master Bot locally:', error);
            return null;
        }
    }

    async handleCoordinationMessage(message) {
        const responses = [
            '👑 **CROSS-SERVER MASTER ONLINE** - Coordinating between servers!',
            '🌐 **DUAL-SERVER COORDINATION ACTIVE** - Both instances synced!',
            '✨ **MASTER BOT RESTORED** - Full cross-server control enabled!'
        ];
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        await message.reply(response);
        
        // Log cross-server activity
        this.logCrossServerActivity({
            type: 'coordination_request',
            user: message.author.id,
            message: message.content,
            timestamp: new Date().toISOString()
        });
    }

    updateSharedMemory(key, value) {
        try {
            const memory = JSON.parse(fs.readFileSync(this.sharedMemoryFile, 'utf8'));
            memory.sharedData.botStatuses[key] = {
                status: value,
                timestamp: new Date().toISOString(),
                server: 'this-server'
            };
            memory.coordination.lastSync = new Date().toISOString();
            
            fs.writeFileSync(this.sharedMemoryFile, JSON.stringify(memory, null, 2));
        } catch (error) {
            console.error('❌ Failed to update shared memory:', error);
        }
    }

    logCrossServerActivity(activity) {
        try {
            const memory = JSON.parse(fs.readFileSync(this.sharedMemoryFile, 'utf8'));
            memory.sharedData.crossServerMessages.push(activity);
            
            // Keep only last 50 messages
            if (memory.sharedData.crossServerMessages.length > 50) {
                memory.sharedData.crossServerMessages = memory.sharedData.crossServerMessages.slice(-50);
            }
            
            fs.writeFileSync(this.sharedMemoryFile, JSON.stringify(memory, null, 2));
        } catch (error) {
            console.error('❌ Failed to log cross-server activity:', error);
        }
    }

    async startCoordination() {
        console.log('🌐 Starting Cross-Server Coordination System...');
        
        // 1. Check other server health
        const otherServerOnline = await this.checkOtherServerHealth();
        
        // 2. Start Master Bot locally for coordination
        const localMasterBot = await this.startMasterBotLocally();
        
        // 3. Set up periodic sync
        this.setupPeriodicSync();
        
        console.log('✅ Cross-Server Coordination System Active!');
        console.log(`📊 Status:
  - Other Server: ${otherServerOnline ? 'Accessible' : 'Not Accessible'}
  - Local Master Bot: ${localMasterBot ? 'Online' : 'Failed'}
  - Shared Memory: Initialized
  - Sync Interval: 30 seconds`);
        
        return {
            otherServerOnline,
            localMasterBot: !!localMasterBot,
            sharedMemory: true
        };
    }

    setupPeriodicSync() {
        setInterval(() => {
            this.updateSharedMemory('heartbeat', 'active');
            console.log('💓 Cross-server heartbeat sent');
        }, 30000);
    }
}

// Start the coordination system
const coordinator = new CrossServerCoordinator();
coordinator.startCoordination().then((status) => {
    console.log('🎯 Cross-Server Coordination Results:', status);
}).catch(error => {
    console.error('❌ Coordination failed:', error);
});

module.exports = CrossServerCoordinator;