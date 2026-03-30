
import {cap} from './index.js'

async function fetchIRE(url){
        try{
            const result = await fetch(`http://api.achaea.com/${url}`)
            const res = await result.json()

            return res
        }catch(err){
            console.error('IRE ERROR', err.message)
        }

}

async function getClass(player){
    try{
        const res = await fetchIRE(`characters/${player}.json`)

        return res.class
    }catch(err){
        console.log('Couldnt get class info')
    }
}


async function getOnline(){
    try {
        const res = await fetchIRE('characters.json')
       
        const ret = {characters: res.characters.map(p=>p.name), count: res.count}
    
        return ret
    } catch (err) {
        console.log(err)
    }
}

async function getGameFeed(){
       let feed = []
            try{
            const res = await fetchIRE('gamefeed.json')
            for (const e of res){
                if (e.type === 'DEA'){
                    feed.push([e.id, e.description])
                }
            }

        }catch (err){
            console.error(err.message)

        }

        return feed
}

    
async function getPlayer(who){
    
if (who === 'Alynzar' || who === 'alynzar'){
    who = 'Alyzar'
}
    
    let player = await fetchIRE(`characters/${who}.json`)

        if (who === 'Alynzar' || who === 'alynzar'){
            player.fullname = "Alynzar, the Best Al'Jafri"
            player.kills = player.kills + 1
            player.mob_kills = player.mob_kills + 1
            player.player_kills = player.player_kills + 1
        }

     if(player.error != null) return 'No character found by the name ' + who
    const buffer = player.fullname.length
    let bufferDisplay = ''
    
   

    let infoDisplay = `City: ${cap(player.city)}
House: ${cap(player.house)}     Class: ${cap(player.class)}
Level: ${player.level} (#${player.xp_rank})     Explorers: ${player.explorer_rank}
Mobs : ${player.mob_kills} Kills: ${player.player_kills}
`

    while (bufferDisplay.length < buffer){
        bufferDisplay = bufferDisplay + '='
    }


    const display = `${player.fullname}\n` + bufferDisplay + '\n' + infoDisplay 
    return display
    
}


getPlayer('Alynzar')

async function getNews(category, postNum, msg){



            try{
            const res = await fetch(`http://api.achaea.com/news/${category}/${postNum}.json`)
            const result = await res.json()
                
           let postDisplay = `
Author:  ${result.post.from}
To:      ${result.post.to}
Subject: ${result.post.subject}
Date:    ${result.post.date_ingame}


        ${result.post.message}`
            

             
        msg.channel.send(result.post.message.length < 3000 ? '```'+ postDisplay + '```' : `https://www.achaea.com/news/${category}/${postNum}`)
               
              
            } catch (err){
                console.error(err)
                msg.channel.send(`Sorry ${msg.author}, but either that post doesn't exist, or you can't see it.`)
            }
    }




    async function pet({author, channel}){
        let reactions = [
            `*Orysia, an ethereal fox gracefully curls around ${author}'s legs.*`,
            `*Orysia, an ethereal fox gives ${author} a friendly cuddle.*`,
            `*Orysia, an ethereal fox tackles ${author} at the knees.*`,
            `*Orysia, an ethereal fox inches bashfully over to ${author} and nuzzles you tenderly.*`,
            `*Orysia, an ethereal fox growls softly, playfully licking at your hand.*`
        ]

        let rndReaction = reactions[Math.floor(Math.random() * reactions.length)]
        
        channel.send(rndReaction)
    }


export {fetchIRE, getClass, getOnline, getGameFeed, getPlayer, getNews, pet}