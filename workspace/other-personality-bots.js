// Other Personality Bots (excluding master - he's creepy now)
const { PersonalityBot, botPersonalities } = require('./enhanced-bot-personalities');

async function launchOtherBots() {
    const tokens = {
        'slave (marketing)': 'MTQ2ODgyNzYwMDEwNDMyOTM5Mw.GNaceU.Hq1FQHS2QWl9kMvB_0ZjVYTaKWEQsm_cPXp4Mc',
        'slave (coding)': 'MTQ2ODgwMzU2ODUxMjQwNTY0OQ.Gi--iN.lX20JP_gIyvWiatwleNioJTvcY5S6Hy_DZSVGY',
        'slave (business)': 'MTQ2ODgwMzkwMzQ5MDM2MzU1OA.GSKnrh.6YMN27fviaM_NWy7gUqFPBduuqko4F-WXMuuOY'
    };

    console.log('🎭 Launching other bots with personalities (master is separate)...');

    for (const [name, personality] of Object.entries(botPersonalities)) {
        if (name === 'slave (master)') continue; // Skip master - he's creepy now
        
        const token = tokens[name];
        if (token) {
            const bot = new PersonalityBot(name, token, personality);
            await bot.start();
            
            // Stagger launches
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }

    console.log('✅ Other personality bots launched (master excluded)!');
}

launchOtherBots();