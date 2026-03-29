import { supabase } from "../server.js";
import { fetchIRE, getClass } from "./IRE.js";

//TODO
// Update kills
// return QWC formatted
// specific queries 
    //get online by city and format
    //KDR to show a formatted display of who has been killed by that person
        //reference this by the death_log table



async function updatePlayerInfo(who){
        console.log('who', who)
        const player = await fetchIRE(`characters/${who}.json`)
        console.log('update', player)
        const {error} = await supabase.from('Players')
                                .update(player)
                                .eq('name', player.name)

        if (!error){
            return player
        }
    }


//pushes a death into the DB under the Death_Log table
async function newDeathLog(killer, killed){
    //table scheme: 

try{
    
    const killer_class = await getClass(killer)
    const killed_class = await getClass(killed)
    
    const {error} = await supabase.from('death_logs').insert({killer, killed, killer_class, killed_class})
    
        if (!error){
            console.log('successfully inserted new death log')
        }
    }catch(err){
        console.log(err.message)
    }
}


async function playerKillStats(player){
    const result = await supabase.from('death_logs').select().eq('killer', player)
    const kills = result.data
    let format = []

    
    kills.forEach((kill)=>{
        
    })
    
}

// newDeathLog('Aranos', 'Puxi')
// newDeathLog('Aranos', 'Puxi')
// newDeathLog('Aranos', 'Puxi')
// newDeathLog('Aranos', 'Claes')
// newDeathLog('Aranos', 'Tabethys')

export {playerKillStats, newDeathLog, updatePlayerInfo}