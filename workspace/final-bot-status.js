// Final Bot Status Check
console.log('🎯 FINAL BOT ARMY STATUS CHECK');
console.log('=====================================');

const { execSync } = require('child_process');

function checkProcesses() {
    console.log('\n📊 RUNNING PROCESSES:');
    
    try {
        const processes = execSync('ps aux | grep node | grep -E "(robust|discord)" | grep -v grep', { encoding: 'utf8' });
        const lines = processes.trim().split('\n');
        
        console.log(`✅ Found ${lines.length} bot processes running:`);
        
        lines.forEach((line, index) => {
            const parts = line.split(/\s+/);
            const pid = parts[1];
            const cmd = line.substring(line.indexOf('node'));
            
            if (cmd.includes('robust-bot-launcher')) {
                console.log(`  👑 MASTER + SLAVES: PID ${pid} (robust launcher)`);
            } else if (cmd.includes('discord-marketing-bot')) {
                console.log(`  📈 MARKETING BOT: PID ${pid} (marketing automation)`);
            } else {
                console.log(`  🤖 OTHER BOT: PID ${pid}`);
            }
        });
        
    } catch (error) {
        console.log('❌ No bot processes found!');
    }
}

function checkBotLogs() {
    console.log('\n📝 RECENT BOT ACTIVITY:');
    
    try {
        const robustLog = execSync('tail -5 /root/clawd/bot-army.log 2>/dev/null', { encoding: 'utf8' });
        console.log('🤖 Robust Bot Log:');
        console.log(robustLog);
    } catch (error) {
        console.log('⚠️ No robust bot log found');
    }
    
    try {
        const marketingLog = execSync('tail -5 /root/clawd-marketing/marketing-bot.log 2>/dev/null', { encoding: 'utf8' });
        console.log('📈 Marketing Bot Log:');
        console.log(marketingLog);
    } catch (error) {
        console.log('⚠️ No marketing bot log found');
    }
}

function generateSummary() {
    console.log('\n🎯 SUMMARY:');
    console.log('=====================================');
    
    try {
        const processes = execSync('ps aux | grep node | grep -E "(robust|discord)" | grep -v grep | wc -l', { encoding: 'utf8' });
        const count = parseInt(processes.trim());
        
        console.log(`📊 Total Bot Processes: ${count}`);
        
        if (count >= 2) {
            console.log('✅ BOT ARMY STATUS: OPERATIONAL');
            console.log('🎯 Expected Bots:');
            console.log('  👑 Master Bot (Zesty Coordinator)');
            console.log('  📈 Marketing Bot (Conversion Engine)');  
            console.log('  💻 Slave 3 (Coding Specialist)');
            console.log('  💰 Slave 4 (Business Specialist)');
            console.log('');
            console.log('💸 READY FOR MONEY-MAKING OPERATIONS!');
        } else {
            console.log('❌ BOT ARMY STATUS: DEGRADED');
            console.log('🔧 Some bots may need restart');
        }
        
    } catch (error) {
        console.log('❌ BOT ARMY STATUS: OFFLINE');
        console.log('🔧 Manual intervention required');
    }
}

// Run all checks
checkProcesses();
checkBotLogs();
generateSummary();