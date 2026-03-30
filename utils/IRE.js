
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
    const player = await fetchIRE(`characters/${who}.json`)
    const buffer = player.fullname.length
    let bufferDisplay = ''


    let infoDisplay = `City: ${cap(player.city)}
House: ${cap(player.house)}
Class: ${cap(player.class)}
Level: ${player.level} (#${player.xp_rank})`

    while (bufferDisplay.length < buffer){
        bufferDisplay = bufferDisplay + '='
    }


    const display = `${player.fullname}\n` + bufferDisplay + '\n' + infoDisplay 
    console.log(display)
    return display
    
}

export {fetchIRE, getClass, getOnline, getGameFeed, getPlayer}