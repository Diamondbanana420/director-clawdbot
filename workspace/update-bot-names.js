// Update Bot Names to "slave (role)" format
const { Client, GatewayIntentBits } = require('discord.js');

const bots = [
    {
        name: 'slave (master)',
        token: 'MTQ2ODgwMjY0NjQ2MTc3OTk5OA.GNCSK4.WXcXt0IeFlEx2kyBSq4i0UiJrnozxFnUPhXQbA',
        guildId: '1467990956891705418'
    },
    {
        name: 'slave (marketing)',
        token: 'MTQ2ODgyNzYwMDEwNDMyOTM5Mw.GNaceU.Hq1FQHS2QWl9kMvB_0ZjVYTaKWEQsm_cPXp4Mc',
        guildId: '1467990956891705418'
    },
    {
        name: 'slave (coding)',
        token: 'MTQ2ODgwMzU2ODUxMjQwNTY0OQ.Gi--iN.lX20JP_gIyvWiatwleNioJTvcY5S6Hy_DZSVGY',
        guildId: '1467990956891705418'
    },
    {
        name: 'slave (business)',
        token: 'MTQ2ODgwMzkwMzQ5MDM2MzU1OA.GSKnrh.6YMN27fviaM_NWy7gUqFPBduuqko4F-WXMuuOY',
        guildId: '1467990956891705418'
    }
];

async function updateBotName(botInfo) {
    const client = new Client({
        intents: [GatewayIntentBits.Guilds]
    });

    try {
        await client.login(botInfo.token);
        
        client.on('ready', async () => {
            console.log(`🔧 Updating ${client.user.tag} to "${botInfo.name}"`);
            
            try {
                // Try to change global username
                await client.user.setUsername(botInfo.name);
                console.log(`✅ Updated global username to: ${botInfo.name}`);
            } catch (error) {
                console.log(`⚠️ Cannot change global username (rate limited): ${error.message}`);
                
                // Fall back to guild nickname
                try {
                    const guild = await client.guilds.fetch(botInfo.guildId);
                    const member = await guild.members.fetch(client.user.id);
                    await member.setNickname(botInfo.name);
                    console.log(`✅ Updated guild nickname to: ${botInfo.name}`);
                } catch (nickError) {
                    console.log(`❌ Failed to set nickname: ${nickError.message}`);
                }
            }
            
            await client.destroy();
        });
        
    } catch (error) {
        console.error(`❌ Error updating ${botInfo.name}: ${error.message}`);
    }
}

async function updateAllBots() {
    console.log('🔄 Updating all bot names to "slave (role)" format...');
    
    for (const bot of bots) {
        await updateBotName(bot);
        // Wait between updates to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    console.log('✅ All bot name updates completed!');
}

updateAllBots();