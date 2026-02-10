// Update All Separate Bot Nicknames
const { Client, GatewayIntentBits } = require('discord.js');

const bots = [
    { name: 'SLAVE#9438', token: 'MTQ2ODQ5NjIzMDY0MzY2Mjg0OA.Gwsx9x.oe7xlu5zMd_W38TohjgKURggiJdlKeEO2CfcGI', role: 'Creepy Master' },
    { name: 'slave (marketing)', token: 'MTQ2ODgyNzYwMDEwNDMyOTM5Mw.GNaceU.Hq1FQHS2QWl9kMvB_0ZjVYTaKWEQsm_cPXp4Mc', role: 'Marketing Specialist' },
    { name: 'slave (coding)', token: 'MTQ2ODgwMzU2ODUxMjQwNTY0OQ.Gi--iN.lX20JP_gIyvWiatwleNioJTvcY5S6Hy_DZSVGY', role: 'Coding Specialist' },
    { name: 'slave (business)', token: 'MTQ2ODgwMzkwMzQ5MDM2MzU1OA.GSKnrh.6YMN27fviaM_NWy7gUqFPBduuqko4F-WXMuuOY', role: 'Business Specialist' },
    { name: 'slave (product research)', token: 'MTQ2ODgwMjY0NjQ2MTc3OTk5OA.GNCSK4.WXcXt0IeFlEx2kyBSq4i0UiJrnozxFnUPhXQbA', role: 'Product Research Specialist' }
];

async function updateNickname(bot) {
    const client = new Client({ intents: [GatewayIntentBits.Guilds] });
    
    return new Promise((resolve) => {
        client.on('ready', async () => {
            try {
                const guild = await client.guilds.fetch('1467990956891705418');
                const member = await guild.members.fetch(client.user.id);
                await member.setNickname(bot.name);
                console.log(`✅ ${bot.role}: Nickname set to "${bot.name}"`);
            } catch (error) {
                console.log(`⚠️ ${bot.role}: ${error.message}`);
            }
            await client.destroy();
            resolve();
        });
        
        client.login(bot.token).catch(() => resolve());
    });
}

async function updateAllNicknames() {
    console.log('🏷️ Updating all separate bot nicknames...');
    
    for (const bot of bots) {
        await updateNickname(bot);
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log('✅ All separate bot nicknames updated!');
}

updateAllNicknames();