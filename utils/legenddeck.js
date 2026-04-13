import {cards, cardDescriptions} from "../deck/cards.js"
import { supabase, gifAPI } from "../server.js"
import {cap, buffer} from './index.js'
import { GiphyFetch } from "@giphy/js-fetch-api"









//returns the card they pulled and updates the database
async function pullNewCard(id){
        let rnd = cards[Math.floor(Math.random() * cards.length)]
        const araCheck = Math.floor(Math.random() * 100) + 1;
        const drawCheck = await supabase.from('deck').select().eq('user_id', id) || false
        rnd = rnd.toLowerCase()
        if (drawCheck?.data == null || drawCheck?.data[0]?.remaining == 0){
            return false
        }

        if (araCheck == 100 || araCheck == 69){
            rnd = 'aranos'
        }
        console.log(id, 'rolled a: ', araCheck)
        let remaining = drawCheck?.data[0]?.remaining - 1
 
        if (remaining < 0){
            remaining = 0
        }

        let charges = drawCheck?.data[0][rnd]

        let newCharge = charges + 1
        
        await supabase.from('deck').upsert({user_id: id, [rnd]:1})

        await supabase.from('deck').update({[rnd]:newCharge, remaining: remaining}).eq('user_id', id)

    return rnd
}


async function getCards(id){
    let player = await supabase.from('deck').select('tesha, watcher, ksha, halos, minkai, anton, imyrr, claes, karalden, abysal, aranos').eq('user_id', id)
    let cards = Object.entries(player?.data[0] || [{}])
    if (cards == 1){
        await pullNewCard(id)
        return
    } 
        
    
    let display = ''
    for (const card of cards){
        for (const des of cardDescriptions){
            if (des.name == cap(card[0])){
                display = display + cap(card[0]) + buffer(card[0], 10) + card[1] + ` ${des.desc}\n`
            }
        }
    }
    if (display?.length === 0){
        display = 'You have to open a sleeve first!'
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
  "did you confirm with Alyzar?",
  "You've got a point!"
    ]


    let kshaTargets = {}

async function drawCard(card, msg, options, client){
    let userID = options?.split('<@')[1]?.split('>')[0] || ''
    let player = await supabase.from('deck').select('tesha, watcher, ksha, halos, minkai, anton, imyrr, claes, karalden, abysal, aranos').eq('user_id', msg.author.id)
    let cards = Object.entries(player?.data[0] || [{}])
    let cardType = cap(card)
    let remainingCharges = {}
    let araCharge = false
    const roleID = '1492952394315857930'

    if (msg.member.roles.cache.has(roleID)){
        msg.channel.send('Know your place Execrant')
        return
    }
    

    for (const c of cards){
        //filling the charge table
        if (!remainingCharges[c[0]]){
            remainingCharges[c[0]] = c[1]
        }
    }

      for (const c of cards){
        if (cardType == 'Aranos' && remainingCharges['aranos'] > 0){
            araCharge = true
            if (c[0] == 'aranos'){
               remainingCharges[c[0]] -= 1 
            }else{
                remainingCharges[c[0]] += 1
            }
        }else if (cap(c[0]) == cardType){
            if (c[1]== 0){
                msg.channel.send(`You have no more ${cardType} cards remaining, spend more money.`)
                return
            }
            remainingCharges[c[0]] -= 1
        }
    }

                const abyResponse = [ 'a','b','c','d','e','f','g','h','i','j','k','l','m',
  'n','o','p','q','r','s','t','u','v','w','x','y','z',
  'A','B','C','D','E','F','G','H','I','J','K','L','M',
  'N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
  '!','@','#','$','%','^','&','*','(',')',
    '[',']','{','}',';',':',
  "'",'"',',','.']
  
     const randomNum = Math.floor(Math.random() * (15 - 10 + 1)) + 10;    
    if (araCharge == true){
        await supabase.from('deck').update(remainingCharges).eq('user_id', msg.author.id)
    }else{
        await supabase.from('deck').update({[card.toLowerCase()]: remainingCharges[cardType.toLowerCase()] }).eq('user_id', msg.author.id)
    }

    if (cardType == 'Tesha'){
        console.log(await msg.channel.setRateLimitPerUser(2).then(()=>{
            setTimeout(()=>{
            msg.channel.setRateLimitPerUser(0)
        },60000)
        }))
        
    }else if (cardType == 'Halos'){
        const channel = client.channels.cache.get(msg.reference.channelId)
        const message = await channel.messages.fetch(msg.reference.messageId)
        message.pin()
    }else if (cardType == 'Anton'){
        const channel = client.channels.cache.get(msg.reference.channelId)
        const message = await channel.messages.fetch(msg.reference.messageId)
        message.delete().then(()=>msg.delete())
    }else if (cardType == 'Watcher'){
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
    }else if(cardType == 'Minkai'){
            let nessage = options.split(' ')
                nessage.shift()
            let fullMessage = nessage.join(' ')
            if (fullMessage == '') return
        const user = await client.users.cache.get(userID)
        user.send(fullMessage).then(sentMsg=>{
            
        })
    msg.delete()
        
    }else if(cardType == 'Ksha'){
        if (kshaTargets[userID] && kshaTargets[userID] != 0) return
        kshaTargets[userID] = 3
        
    }else if (cardType == 'Claes'){
        
        msg.channel.threads.create({
    name: options,
    autoArchiveDuration: 60,
    reason: '',
})  
    }else if (cardType == 'Imyrr'){
        const gf = new GiphyFetch(gifAPI)
        const {data: gifs} = await gf.random()
        msg.channel.send(gifs.images.original.url)
    }else if (cardType == 'Abysal'){
        let i = 0
        let display = ''
        while (i < randomNum){
            const randomChar = abyResponse[Math.floor(Math.random() * abyResponse.length)]

            display = display + randomChar
            i++
        }
        let sentMsg = msg
        msg.channel.send(display)
        sentMsg.delete()
    }else if (cardType == 'Karalden'){
         
        
         const {id: pingedID} = await msg.mentions.users.first()
         const user = await msg.guild.members.cache.get(pingedID)
         await user.roles.add(roleID)
         setTimeout(async ()=>{
            await user.roles.remove(roleID)
            
         },1800000)
         msg.channel.send('Know your place Execrant.')
    }else if (cardType == 'Aranos'){
        msg.channel.send('```\nYou have been granted 1 charge in every card, use them wisely.```')
    }
}





async function cardHelp(){
    return `\n!ldeck unwrap sleeve -- Opens a new sleeve if you have any remaining.
!ldeck open sleeve -- Does the same as above.
!deck -- Displays the cards you have.
!cards -- Same as above.`
}












async function refreshDraws(){
        await supabase.from('deck').update({remaining: 3}).neq('id', 0)
        console.log('UPDATING DRAWS -- FOR ALL PLAYERS')
}

async function refreshActionPulls(){
        await supabase.from('deck').update()
}

setInterval(async () => {
    await refreshDraws()
}, 3600000);

export {pullNewCard, getCards, drawCard, kshaTargets, refreshDraws, refreshActionPulls, cardHelp}
