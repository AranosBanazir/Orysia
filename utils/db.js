import { supabase } from "../server.js";
import { fetchIRE, getClass } from "./IRE.js";
import {cap} from './index.js'

//Did today
    //Added db fetch requests and formatting for kills by class
    //set up the structure of the DB

//TODO
    //set up KDR to show seperate from requesting a class
    



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


async function playerKillStats(player, killerClass){
    let result = await supabase.from('death_logs').select().eq('killer', player).eq('killer_class', killerClass)

    const kills = result.data
    let display = ``

        const format = {}

        

       kills.forEach(({ killer, killed, killer_class, killed_class }) => {
        if (!format[killer]) format[killer] = {};

        if (!format[killer][killer_class]) {
            format[killer][killer_class] = {};
        }

        const victimKey = `${killed}|${killed_class}`;

        if (!format[killer][killer_class][victimKey]) {
            format[killer][killer_class][victimKey] = {
            killed,
            killed_class,
            count: 0
            };
        }

        format[killer][killer_class][victimKey].count++;
        });

   

//formats based on the kills

  Object.entries(format).forEach(([killer, classes]) => {
  display = display + `Recorded kills for ${cap(killer)} in: `;

  Object.entries(classes).forEach(([killerClass, victims]) => {
        display = display + `${cap(killerClass)}\n`
    Object.values(victims).forEach(v => {
      display = display + (
        `${cap(v.killed)} (${cap(v.killed_class)}) x${v.count}`+'\n'
      );
    });
  });
});

    if (kills.length === 0 && killerClass == undefined){
        return `You must include a class to get the stats for ${cap(player)}. Try: !kdr ${cap(player)} <class>`
    }else if (kills.length === 0 && killerClass != undefined){
        return `No kills found for ${cap(player)} in ${cap(killerClass)}`
    }else{
        return display
    }
}




export {playerKillStats, newDeathLog, updatePlayerInfo}