// Test Bot Responses
const { Client, GatewayIntentBits } = require('discord.js');

async function testBots() {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent
        ]
    });

    client.on('ready', async () => {
        console.log('🔍 Testing bot responses...');
        
        const channel = await client.channels.fetch('1467990957629640850');
        
        // Test each bot
        await channel.send('🔧 **TESTING ALL BOTS** - Please respond if online!');
        
        setTimeout(() => {
            process.exit(0);
        }, 10000);
    });

    await client.login('MTQ2ODgyNzYwMDEwNDMyOTM5Mw.GNaceU.Hq1FQHS2QWl9kMvB_0ZjVYTaKWEQsm_cPXp4Mc');
}

testBots();