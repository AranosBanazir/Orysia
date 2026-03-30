import { supabase } from "../server.js";
import { fetchIRE, getClass, getOnline, cap, getGameFeed} from "./index.js";


//Did today
    //Added db fetch requests and formatting for kills by class
    //set up the structure of the DB

//TODO
    //set up KDR to show seperate from requesting a class



//TODO this does not work, will need to update first and if the return is not a player, insert
async function updatePlayerInfo(who, kdr){
        let player = await fetchIRE(`characters/${who}.json`)
         
        if (kdr){
            player = {kdr:kdr, ...player}
        }



        const {error, data} = await supabase.from('Players')
                                .update(player)
                                .eq('name', who)
                                .select()
                              
            if (data.length === 0 ){
                await supabase.from('Players')
                              .insert(player)
                              
            }                 
        
        if (!error){
        }else{
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
    let result = await supabase.from('death_logs').select().eq('killer', cap(player)).eq('killer_class', killerClass.toLowerCase())

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


//populate DB from Game Information
async function updatePlayerDB(){
    const players = await getOnline()

    for (const player of players.characters){
        await updatePlayerInfo(player)
    }
    console.log('Finished updating Database.')
}



async function getKDR(who){
    await updateDeathLogs()
    const kills = await supabase.from('death_logs').select('*', {count: 'exact', head: true}).eq('killer', cap(who))
    const deaths = await supabase.from('death_logs').select('*', {count: 'exact', head: true}).eq('killed', cap(who))

    console.log(kills)
    let num = kills.count / deaths.count
    let ratio = parseFloat(num.toFixed(1))

    return {k: kills.count, d: deaths.count, kdr: ratio}

}


//TODO death Logs needs a tracked ID function to pull tracked id's to not insert uncessarily


async function updateDeathLogs(){
    const feed = await getGameFeed()
    let regex = /^\w+ was slain by \w+.$/
    const events = feed.filter(e=>{
        if (regex.test(e[1]) && e[1].split(' ')[4] != 'misadventure'){
            return {event_id: e[0], desc:e[1]}
        }
    })

    let bulk = []
    
    for (const event of events){
        let killer = event[1].split(' ')[4].split('.')[0]
        let killed = event[1].split(' ')[0]
        let killer_class = await getClass(killer)
        let killed_class = await getClass(killed)

        bulk.push({killer, killed, killer_class, killed_class, event_id:event[0]})
    }

    await supabase.from('death_logs').insert(bulk)
}

// updatePlayerDB()
export {playerKillStats, newDeathLog, updatePlayerInfo, getKDR}