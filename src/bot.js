import {Client, GatewayIntentBits} from 'discord.js';
import {createServer, port} from '../server.js';
import { getCommands, getGlobalClassStats, playerKillStats, getKDR, getPlayer, cap, getPlayers, getNews, pet, getPlayerKills} from '../utils/index.js';


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
            let res = await getPlayerKills(who)
           msg.channel.send('```ruby\n' + res + '```')
        }else if (content === '!qwc' || content === '!QWC'){
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
        }else if (content === '!classleaderboard'){
           msg.channel.send('```ruby\n' + await getGlobalClassStats() + '```')
        }else if (content === '!commands'){
            const commands = getCommands()
            msg.channel.send('```\n' + commands + '```')
        }
}})