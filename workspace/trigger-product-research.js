// Trigger Product Research Programmatically
const { Client, GatewayIntentBits } = require('discord.js');

async function triggerProductResearch(channelId = '1467990957629640850') {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent
        ]
    });

    return new Promise((resolve, reject) => {
        client.on('ready', async () => {
            try {
                const channel = await client.channels.fetch(channelId);
                
                // Trigger research by mentioning the bot
                await channel.send('<@1468802646461779998> research products - find 3 profitable dropshipping products with full analysis');
                
                console.log('✅ Product research triggered successfully');
                await client.destroy();
                resolve(true);
            } catch (error) {
                console.error('❌ Failed to trigger research:', error);
                await client.destroy();
                reject(error);
            }
        });

        client.login('MTQ2ODgyNzYwMDEwNDMyOTM5Mw.GNaceU.Hq1FQHS2QWl9kMvB_0ZjVYTaKWEQsm_cPXp4Mc').catch(reject);
    });
}

// Helper function to read latest research results
function getResearchResults() {
    const fs = require('fs');
    try {
        const data = fs.readFileSync('/root/clawd/latest-product-research.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { error: 'No research data available', details: error.message };
    }
}

// Export for use by other scripts
module.exports = { triggerProductResearch, getResearchResults };

// CLI usage
if (require.main === module) {
    const action = process.argv[2];
    
    if (action === 'trigger') {
        triggerProductResearch().then(() => {
            console.log('Research triggered!');
            process.exit(0);
        }).catch(error => {
            console.error('Failed:', error);
            process.exit(1);
        });
    } else if (action === 'results') {
        const results = getResearchResults();
        console.log(JSON.stringify(results, null, 2));
    } else {
        console.log('Usage: node trigger-product-research.js [trigger|results]');
    }
}