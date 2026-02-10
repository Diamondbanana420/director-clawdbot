// Update Research Bot Nickname
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.on('ready', async () => {
    console.log(`🔧 Updating research bot ${client.user.tag} nickname`);
    
    try {
        const guild = await client.guilds.fetch('1467990956891705418');
        const member = await guild.members.fetch(client.user.id);
        await member.setNickname('slave (product research)');
        console.log('✅ Nickname updated to: slave (product research)');
    } catch (error) {
        console.log(`⚠️ Nickname update failed: ${error.message}`);
    }
    
    await client.destroy();
    process.exit(0);
});

client.login('MTQ2ODgwMjY0NjQ2MTc3OTk5OA.GNCSK4.WXcXt0IeFlEx2kyBSq4i0UiJrnozxFnUPhXQbA');