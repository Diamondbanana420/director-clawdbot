// Create Specialized Text Channels for Each Bot
const { Client, GatewayIntentBits, ChannelType, PermissionFlagsBits } = require('discord.js');

class ChannelManager {
    constructor() {
        this.token = 'MTQ2ODgyNzYwMDEwNDMyOTM5Mw.GNaceU.Hq1FQHS2QWl9kMvB_0ZjVYTaKWEQsm_cPXp4Mc';
        this.guildId = '1467990956891705418';
        this.client = new Client({
            intents: [GatewayIntentBits.Guilds]
        });
        
        this.requiredChannels = [
            { name: 'marketing', topic: '📈 Marketing automation, campaigns, and social media content generation' },
            { name: 'development', topic: '💻 Full-stack development, app creation, and technical implementations' },
            { name: 'product-research', topic: '📊 Dropshipping product research, analysis, and listing data' },
            { name: 'business', topic: '💰 Financial evaluation, business strategy, and expansion planning' },
            { name: 'bot-creation', topic: '👁️ Custom bot creation and AI assistant development' }
        ];
    }

    async createChannels() {
        try {
            await this.client.login(this.token);
            
            this.client.on('ready', async () => {
                console.log('🔧 Channel Manager ready - Creating specialized channels...');
                
                const guild = await this.client.guilds.fetch(this.guildId);
                const existingChannels = guild.channels.cache;
                
                for (const channelData of this.requiredChannels) {
                    const existing = existingChannels.find(ch => ch.name === channelData.name);
                    
                    if (existing) {
                        console.log(`✅ Channel "${channelData.name}" already exists`);
                        // Update topic if different
                        if (existing.topic !== channelData.topic) {
                            await existing.setTopic(channelData.topic);
                            console.log(`📝 Updated topic for "${channelData.name}"`);
                        }
                    } else {
                        const newChannel = await guild.channels.create({
                            name: channelData.name,
                            type: ChannelType.GuildText,
                            topic: channelData.topic,
                            reason: 'Creating specialized bot channels'
                        });
                        console.log(`✅ Created new channel "${channelData.name}": ${newChannel.id}`);
                    }
                }
                
                // Clean up old channels if needed
                const oldChannels = ['general-old', 'test-old'];
                for (const oldName of oldChannels) {
                    const oldChannel = existingChannels.find(ch => ch.name === oldName);
                    if (oldChannel) {
                        console.log(`🗑️ Removing old channel: ${oldName}`);
                        // await oldChannel.delete(); // Uncomment to actually delete
                    }
                }
                
                console.log('🎯 Channel configuration complete!');
                await this.client.destroy();
                process.exit(0);
            });
            
        } catch (error) {
            console.error('❌ Channel creation failed:', error);
            process.exit(1);
        }
    }
}

const manager = new ChannelManager();
manager.createChannels();