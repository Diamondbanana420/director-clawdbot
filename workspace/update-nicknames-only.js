// Update Discord Server Nicknames Only
const { Client, GatewayIntentBits } = require('discord.js');

const bots = [
    {
        name: 'SLAVE#9438',
        token: 'MTQ2ODQ5NjIzMDY0MzY2Mjg0OA.Gwsx9x.oe7xlu5zMd_W38TohjgKURggiJdlKeEO2CfcGI',
        role: 'Original Creepy Master'
    },
    {
        name: 'slave (coordinator)',
        token: 'MTQ2ODgwMjY0NjQ2MTc3OTk5OA.GNCSK4.WXcXt0IeFlEx2kyBSq4i0UiJrnozxFnUPhXQbA',
        role: 'Professional Coordinator'
    },
    {
        name: 'slave (marketing)',
        token: 'MTQ2ODgyNzYwMDEwNDMyOTM5Mw.GNaceU.Hq1FQHS2QWl9kMvB_0ZjVYTaKWEQsm_cPXp4Mc',
        role: 'Conversion Specialist'
    },
    {
        name: 'slave (coding)',
        token: 'MTQ2ODgwMzU2ODUxMjQwNTY0OQ.Gi--iN.lX20JP_gIyvWiatwleNioJTvcY5S6Hy_DZSVGY',
        role: 'Development Specialist'
    },
    {
        name: 'slave (business)',
        token: 'MTQ2ODgwMzkwMzQ5MDM2MzU1OA.GSKnrh.6YMN27fviaM_NWy7gUqFPBduuqko4F-WXMuuOY',
        role: 'Market Analyst'
    }
];

async function updateNickname(botInfo) {
    const client = new Client({
        intents: [GatewayIntentBits.Guilds]
    });

    return new Promise((resolve) => {
        client.on('ready', async () => {
            console.log(`🔧 Updating nickname for ${client.user.tag}`);
            
            try {
                const guild = await client.guilds.fetch('1467990956891705418');
                const member = await guild.members.fetch(client.user.id);
                await member.setNickname(botInfo.name);
                console.log(`✅ ${botInfo.role}: Nickname set to "${botInfo.name}"`);
            } catch (error) {
                console.log(`❌ ${botInfo.role}: Nickname failed - ${error.message}`);
            }
            
            await client.destroy();
            resolve();
        });
        
        client.login(botInfo.token).catch(error => {
            console.error(`❌ Login failed for ${botInfo.role}:`, error);
            resolve();
        });
    });
}

async function updateAllNicknames() {
    console.log('🏷️ Updating Discord server nicknames...');
    console.log('=====================================');
    
    for (const bot of bots) {
        await updateNickname(bot);
        // Wait between updates
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log('=====================================');
    console.log('✅ All nickname updates completed!');
    console.log('');
    console.log('📋 UPDATED NICKNAMES:');
    bots.forEach(bot => {
        console.log(`  ${bot.role}: "${bot.name}"`);
    });
}

updateAllNicknames();