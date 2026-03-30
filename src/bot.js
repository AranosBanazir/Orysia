import {Client, GatewayIntentBits} from 'discord.js';
import {createServer, port} from '../server.js';
import { playerKillStats, getKDR, getPlayer } from '../utils/index.js';

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
    const content = msg.content
    const kdrSpecific = /^\!kdr \w+ \w+$/
    const kdr = /^\!kdr \w+$/
    const whois = /\!whois \w+$/



    console.log('header', content)
    if (!msg.author.bot){
        if (kdrSpecific.test(content)){
            const who = content.split(' ')[1]
            const whoClass = content.split(' ')[2]

           let res = await playerKillStats(who, whoClass)

           msg.channel.send('```' + res + '```')
        }

    }else if (whois.test(content)){
        const who = content.split(' ')[1]
        const display = await getPlayer(who)

        msg.channel.send(display)
    }else if (kdr.test(content)){
        const who = content.split(' ')[1]
        console.log(who)
       const {k, d, kdr} = await getKDR(who)
        
       msg.channel.send('``' +`${who} has a KDR of ${kdr} with ${k} kills and ${d} deaths.` + '``')
    }
})