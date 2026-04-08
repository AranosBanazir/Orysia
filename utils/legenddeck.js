import {cards, cardDescriptions} from "../deck/cards.js"
import { supabase } from "../server.js"
import {cap, buffer} from './index.js'











//returns the card they pulled and updates the database
async function pullNewCard(set, id){
        let rnd = cards[Math.floor(Math.random() * cards.length)]
        const drawCheck = await supabase.from('deck').select().eq('user_id', id)
        rnd = rnd.toLowerCase()
            
        if (drawCheck?.data[0]?.remaining === 0){
            return 'out of draws'
        }

        let remaining = drawCheck?.data[0].remaining - 1
        
        await supabase.from('deck').upsert({user_id: id, [rnd]:1})

        await supabase.from('deck').update({[rnd]:1, remaining: remaining}).eq('user_id', id)

    return rnd
}


async function getCards(id){
    let player = await supabase.from('deck').select('tesha, watcher, ksha, halos, minkai, anton, imyrr, claes').eq('user_id', id)
    let cards = Object.entries(player.data[0])
    

    let display = ''
    for (const card of cards){
        for (const des of cardDescriptions){
            if (des.name == cap(card[0])){
                display = display + cap(card[0]) + buffer(card[0], 10) + card[1] + ` ${des.desc}\n`
            }
        }
    }
    return display
}

    const responses = [
  "that is crazy",
  "hmm... have you had that independently verified?",
  "I'm sorry that you feel that way",
  "I think you're on to something there, actually!",
  "wait...",
  "haha, good one",
  "did you confirm with Alyzar?"
    ]


    let kshaTargets = {}

async function drawCard(card, msg, options, client){
    let userID = options?.split('<@')[1]?.split('>')[0] || ''
    'claes'
    if (card == 'Tesha'){
        console.log(await msg.channel.setRateLimitPerUser(2).then(()=>{
            setTimeout(()=>{
            msg.channel.setRateLimitPerUser(0)
        },60000)
        }))
        
    }else if (card == 'Halos'){
        const channel = client.channels.cache.get(msg.reference.channelId)
        const message = await channel.messages.fetch(msg.reference.messageId)
        message.pin()
    }else if (card == 'Anton'){
        const channel = client.channels.cache.get(msg.reference.channelId)
        const message = await channel.messages.fetch(msg.reference.messageId)
        message.delete().then(()=>msg.delete())
    }else if (card == 'Watcher'){
         const user = await msg.guild.members.cache.get(userID)
         try{
            let nick = options.split(' ')
            nick.shift()
            let nickname = nick.join(' ')
            if (nickname.length >31){
                msg.channel.send('Choose a better nickname.')
            }else{

                user.setNickname(nickname)
            }
         }catch(err){
            console.log(err.message)
         }
        
        // console.log(msg)
    }else if(card == 'Minkai'){
            let nessage = options.split(' ')
                nessage.shift()
            let fullMessage = nessage.join(' ')
        const user = await client.users.cache.get(userID)
        user.send(fullMessage).then(sentMsg=>{
            
        })
    msg.delete()
        
    }else if(card == 'Ksha'){
        if (kshaTargets[userID] && kshaTargets[userID] != 0) return
        kshaTargets[userID] = 3
        console.log(kshaTargets)
    }

    


}


export {pullNewCard, getCards, drawCard, kshaTargets}
