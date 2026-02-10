// Force Update Discord Nicknames
const { Client, GatewayIntentBits } = require('discord.js');

const bots = [
    {
        name: 'slave (master)',
        token: 'MTQ2ODgwMjY0NjQ2MTc3OTk5OA.GNCSK4.WXcXt0IeFlEx2kyBSq4i0UiJrnozxFnUPhXQbA'
    },
    {
        name: 'slave (marketing)', 
        token: 'MTQ2ODgyNzYwMDEwNDMyOTM5Mw.GNaceU.Hq1FQHS2QWl9kMvB_0ZjVYTaKWEQsm_cPXp4Mc'
    },
    {
        name: 'slave (coding)',
        token: 'MTQ2ODgwMzU2ODUxMjQwNTY0OQ.Gi--iN.lX20JP_gIyvWiatwleNioJTvcY5S6Hy_DZSVGY'
    },
    {
        name: 'slave (business)',
        token: 'MTQ2ODgwMzkwMzQ5MDM2MzU1OA.GSKnrh.6YMN27fviaM_NWy7gUqFPBduuqko4F-WXMuuOY'
    }
];

async function forceUpdateNicknames() {
    console.log('🔄 Force updating Discord nicknames in guild...');
    
    for (const bot of bots) {
        const client = new Client({
            intents: [GatewayIntentBits.Guilds]
        });

        try {
            await client.login(bot.token);
            
            await new Promise((resolve) => {
                client.on('ready', async () => {
                    console.log(`🔧 Force updating ${client.user.tag} nickname to "${bot.name}"`);
                    
                    try {
                        const guild = await client.guilds.fetch('1467990956891705418');
                        const member = await guild.members.fetch(client.user.id);
                        await member.setNickname(bot.name);
                        console.log(`✅ Nickname updated: ${bot.name}`);
                    } catch (error) {
                        console.log(`⚠️ Nickname update failed: ${error.message}`);
                    }
                    
                    await client.destroy();
                    resolve();
                });
            });
            
        } catch (error) {
            console.error(`❌ Error with ${bot.name}: ${error.message}`);
        }
        
        // Wait between updates
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log('✅ All Discord nickname updates completed!');
}

forceUpdateNicknames();