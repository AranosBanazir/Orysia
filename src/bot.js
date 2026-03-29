import {Client, GatewayIntentBits} from 'discord.js';
import {createServer, port} from '../server.js';
import { playerKillStats } from '../utils/index.js';

const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});


const app = createServer(bot);

bot.once('clientReady', () => {
    console.log(`Logged in as ${bot.user.tag}!`);

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});

bot.login(process.env.BOT_TOKEN);


bot.on('messageCreate', async (msg)=>{
    if (!msg.author.bot){
        if (msg.content === '!kdr'){
           let res = await playerKillStats('Aranos', 'paladin')

           msg.channel.send('```' + res + '```')
        }

    }
})