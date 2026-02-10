// Update Marketing Bot Name
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.on('ready', async () => {
    console.log(`🔧 Updating marketing bot ${client.user.tag} to "slave (marketing)"`);
    
    try {
        await client.user.setUsername('slave (marketing)');
        console.log('✅ Marketing bot name updated to: slave (marketing)');
    } catch (error) {
        console.log(`⚠️ Cannot change username (rate limited): ${error.message}`);
        
        try {
            const guild = await client.guilds.fetch('1467990956891705418');
            const member = await guild.members.fetch(client.user.id);
            await member.setNickname('slave (marketing)');
            console.log('✅ Marketing bot nickname updated to: slave (marketing)');
        } catch (nickError) {
            console.log(`❌ Failed to set nickname: ${nickError.message}`);
        }
    }
    
    await client.destroy();
    process.exit(0);
});

client.login('MTQ2ODgyNzYwMDEwNDMyOTM5Mw.GNaceU.Hq1FQHS2QWl9kMvB_0ZjVYTaKWEQsm_cPXp4Mc');