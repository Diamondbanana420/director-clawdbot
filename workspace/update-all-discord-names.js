// Update All Discord Names for Bot Army
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

async function updateBotName(botInfo) {
    const client = new Client({
        intents: [GatewayIntentBits.Guilds]
    });

    return new Promise((resolve) => {
        client.on('ready', async () => {
            console.log(`🔧 Updating ${client.user.tag} to "${botInfo.name}"`);
            
            try {
                // Try global username first
                await client.user.setUsername(botInfo.name);
                console.log(`✅ ${botInfo.role}: Global name updated to "${botInfo.name}"`);
            } catch (error) {
                // Fallback to guild nickname
                try {
                    const guild = await client.guilds.fetch('1467990956891705418');
                    const member = await guild.members.fetch(client.user.id);
                    await member.setNickname(botInfo.name);
                    console.log(`✅ ${botInfo.role}: Nickname updated to "${botInfo.name}"`);
                } catch (nickError) {
                    console.log(`⚠️ ${botInfo.role}: Name update limited - ${error.message}`);
                }
            }
            
            await client.destroy();
            resolve();
        });
        
        client.login(botInfo.token).catch(error => {
            console.error(`❌ Failed to login ${botInfo.role}:`, error);
            resolve();
        });
    });
}

async function updateAllNames() {
    console.log('🔄 Updating all Discord bot names...');
    console.log('=====================================');
    
    for (const bot of bots) {
        await updateBotName(bot);
        // Wait between updates to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    console.log('=====================================');
    console.log('✅ All Discord name updates completed!');
    console.log('');
    console.log('📋 FINAL BOT NAMES:');
    bots.forEach(bot => {
        console.log(`  ${bot.role}: "${bot.name}"`);
    });
}

updateAllNames();