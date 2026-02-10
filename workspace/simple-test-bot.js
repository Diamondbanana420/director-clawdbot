// Simple Test Bot to Diagnose Issues
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.on('ready', () => {
    console.log(`✅ Test bot ${client.user.tag} ready!`);
    console.log(`🆔 Bot ID: ${client.user.id}`);
});

client.on('messageCreate', async (message) => {
    console.log(`📝 Message from ${message.author.username}: "${message.content}"`);
    console.log(`❓ Mentions me: ${message.mentions.has(client.user.id)}`);
    console.log(`🤖 Is bot message: ${message.author.bot}`);
    
    if (message.author.bot) return;
    
    if (message.mentions.has(client.user.id)) {
        console.log('✅ Responding to mention...');
        try {
            await message.reply('🔧 **TEST BOT RESPONDING** - Mention detection working!');
            console.log('✅ Response sent successfully');
        } catch (error) {
            console.error('❌ Failed to send response:', error);
        }
    }
});

client.on('error', (error) => {
    console.error('❌ Bot error:', error);
});

client.login('MTQ2ODgwMjY0NjQ2MTc3OTk5OA.GNCSK4.WXcXt0IeFlEx2kyBSq4i0UiJrnozxFnUPhXQbA')
    .then(() => console.log('🔗 Login successful'))
    .catch(error => console.error('❌ Login failed:', error));