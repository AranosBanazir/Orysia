import {Client, GatewayIntentBits} from 'discord.js';
import {createServer, port} from '../server.js';
import {refreshActionPulls, refreshDraws, drawCard, getCommands, getGlobalClassStats, playerKillStats, getKDR, getPlayer, cap, getPlayers, getNews, pet, getPlayerKills, pullNewCard, getCards, kshaTargets} from '../utils/index.js';


const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
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
    const ldeck = /^!ldeck draw \w+\s?.+/
  
    const responses = [
  "that is crazy",
  "hmm... have you had that independently verified?",
  "I'm sorry that you feel that way",
  "I think you're on to something there, actually!",
  "wait...",
  "haha, good one",
  "did you confirm with Alyzar?"
    ]
    if (!msg.author.bot){
        if (kshaTargets[msg.author.id]){
            if (kshaTargets[msg.author.id] == 0) return
            kshaTargets[msg.author.id] = kshaTargets[msg.author.id] - 1
            const rndResponse = responses[Math.floor(Math.random() * responses.length)]
            msg.reply(rndResponse)
        }


        if (kdrSpecific.test(content)){
            const who = content.split(' ')[1]
            const whoClass = content.split(' ')[2]

           let res = await playerKillStats(who, whoClass)

           msg.channel.send('```ruby\n' + res + '```')
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
        }else if (content === '!cards' || content === '!deck'){
          let test = await getCards(msg.author.id)
            msg.channel.send('```ruby\n' + test + '```')
        }else if (ldeck.test(content)){
            let who = content.split(' ')[2]
            let options = []
             
                 options = content.split(' ').slice(3).join(' ')
             
            
             await drawCard(who, msg, options, bot)
        }else if (content === '!ldeck unwrap sleeve' || content === '!deck open sleeve' || content == '!unwrap sleeve' || content === '!open sleeve'){
           let card = await pullNewCard(msg.author.id)
            if (!card){
                msg.channel.send('```' + 'You are currently out of pulls, please buy more premium currency.' + '```')
            }else{
                msg.channel.send(`<@${msg.author.id}> triumphantly drew ${cap(card)}`)
            }
        }else if (content === '!refresh draws' && msg.author.id == '582125240696569857'){
            await refreshDraws()
        }else if (content === '!refresh actions' && msg.author.id == '582125240696569857'){
            await refreshActionPulls()
        }
}})