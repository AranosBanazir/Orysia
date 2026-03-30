import {Client, GatewayIntentBits} from 'discord.js';
import {createServer, port} from '../server.js';
import { playerKillStats, getKDR, getPlayer, cap, getPlayers, getNews, pet} from '../utils/index.js';


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
    const qwc   = /\!qwc/
    const news  = /^\!news (\w+) (\d+)$/


    if (!msg.author.bot){
        if (kdrSpecific.test(content)){
            const who = content.split(' ')[1]
            const whoClass = content.split(' ')[2]

           let res = await playerKillStats(who, whoClass)

           msg.channel.send('```' + res + '```')
        }else if (whois.test(content)){
            const who = content.split(' ')[1]
            const display = await getPlayer(who)
            msg.channel.send('```' + display + '```')
        }else if (kdr.test(content)){
            const who = content.split(' ')[1]
            const {k, d, kdr} = await getKDR(who) 
            msg.channel.send('``' +`${cap(who)} has a KDR of ${kdr} with ${k} kills and ${d} deaths.` + '``')
        }else if (qwc.test(content)){
            const emoji = bot.emojis.cache.get('1485427009260753007')
            msg.channel.send(`Updating player database...${emoji}`).then(async sentMsg=>{
                    const msgID = sentMsg.id
                    const data = await getPlayers()
                    msg.channel.send('```' + data + '```').then(()=>{
                        sentMsg.delete()
                    })

                })
        }else if(news.test(content)){
            let category = msg.content.split(' ')[1].trim()
            let postNum = msg.content.split(' ')[2].trim()
            getNews(category, postNum, msg)
        }else if (content === '!pet'){
            pet(msg)
        }
}})