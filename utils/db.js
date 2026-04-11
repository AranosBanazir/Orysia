import { supabase } from "../server.js";
import { fetchIRE, getClass, getOnline, cap, getGameFeed} from "./index.js";
import { Grim } from "../server.js";
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
                              
            if (data?.length === 0 ){
                await supabase.from('Players')
                              .insert(player)
                              
            }                 
        
        if (!error){
        }else{
        }
    }


//pushes a death into the DB under the Death_Log table
async function newDeathLog(killer, killed){
  

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
         updatePlayerInfo(player)
    }
    console.log('Finished updating Database.')
}



async function getKDR(who){
   // await updateDeathLogs()
    const kills = await supabase.from('death_logs').select('*', {count: 'exact', head: true}).eq('killer', cap(who))
    const deaths = await supabase.from('death_logs').select('*', {count: 'exact', head: true}).eq('killed', cap(who))

    let num = kills.count / deaths.count
    let ratio = parseFloat(num.toFixed(1))

    if (deaths.count == 0){
        ratio = kills.count
    }

    return {k: kills.count, d: deaths.count, kdr: ratio}

}


                        





    async function getPlayers() {
        // await updatePlayerDB()
        const {data} = await supabase.from('Players').select()
        const {characters, count: playerCount} = await getOnline()
        let cities = {
            'mhaldor': [],
            'targossas': [],
            'eleusis': [],
            'cyrene': [],
            'hashan': [],
            'ashtan': [],
            '(none)': [],
            '(hidden)': [],
            'other': []
        }

        for (const player of data){
            const {name, city} = player
         if (characters.includes(name)){
            cities[city].push(name)
        }

        cities.targossas.sort()
        cities.mhaldor.sort()
        cities.hashan.sort()
        cities.cyrene.sort()
        cities.eleusis.sort()
        cities.ashtan.sort()
        cities["(hidden)"].sort()
        cities["(none)"].sort()

        
        }
        let display = `${playerCount} Players Currently in Realms
Targossas [${cities.targossas.length}]: ${cities.targossas.join(', ')}
Mhaldor   [${cities.mhaldor.length}]: ${cities.mhaldor.join(', ')}
Hashan    [${cities.hashan.length}]: ${cities.hashan.join(', ')}
Ashtan    [${cities.ashtan.length}]: ${cities.ashtan.join(', ')}
Eleusis   [${cities.eleusis.length}]: ${cities.eleusis.join(', ')}
Rogue     [${cities['(none)'].length}]: ${cities['(none)'].join(', ')}
Hidden    [${cities['(hidden)'].length}]: ${cities['(hidden)'].join(', ')}
Cyrene    [${cities.cyrene.length}]: ${cities.cyrene.join(', ')}`


        return display
    }


    
async function updateDeathLogs(){
    const feed = await getGameFeed()
    let death = /^\w+ was slain by \w+.$/
    let duel  = /^\w+ defeated \w+ in the Oniar Estate.$/
    const events = feed.filter(e=>{
        if (death.test(e[1]) && (e[1].split(' ')[4] != 'misadventure.')){
          
            return {event_id: e[0], desc:e[1]}
        }else if (duel.test(e[1])){
            
            return {event_id: e[0], desc:e[1]}
        }
    })
    let bulk = []
    const ids = await supabase.from('death_logs').select('event_id')

    let eventIds = ids.data.map(e=>{
        return e.event_id
    })
    
    for (const event of events){


        if (!eventIds.includes(event[0])){
            if (death.test(event[1])){
                let killer = event[1].split(' ')[4].split('.')[0]
                let killed = event[1].split(' ')[0]
                let killer_class = await getClass(killer)
                let killed_class = await getClass(killed)
                Grim(killer, killed, killer_class, killed_class, false)
                bulk.push({killer, killed, killer_class, killed_class, event_id:event[0], arena: false})
            }else if (duel.test(event[1])){
                let killer = event[1].split(' ')[0]
                let killed = event[1].split(' ')[2]
                let killer_class = await getClass(killer)
                let killed_class = await getClass(killed)
                Grim(killer, killed, killer_class, killed_class, true)
                bulk.push({killer, killed, killer_class, killed_class, event_id:event[0], arena: true})
            }

        }
    }

    const {data, error} = await supabase.from('death_logs').insert(bulk).select()

    if (data?.length > 0){
        console.log(data)
    }
}



async function getPlayerKills(player){
    let result = await supabase.from('death_logs').select().eq('killer', cap(player))
    let kdr = await getKDR(player)
    const kills = result.data
    let display = ``

        const format = {}

        

       kills.forEach(({ killer, killed, killer_class, killed_class, arena }) => {
        if (!format[killer]) format[killer] = {};

        if (!format[killer][killer_class]) {
            format[killer][killer_class] = {};
        }

        const victimKey = `${killed}|${killed_class}`;

        if (!format[killer][killer_class][victimKey]) {
            format[killer][killer_class][victimKey] = {
            killed,
            killed_class,
            count: 0,
            arena
            };
        }

        format[killer][killer_class][victimKey].count++;
        });

   

//formats based on the kills

  Object.entries(format).forEach(([killer, classes]) => {
  display = display + `${cap(killer)} had a KDR of ${kdr.kdr} with ${kdr.k} kills to ${kdr.d} deaths.\n\n`;

  Object.entries(classes).forEach(([killerClass, victims]) => {
        display = display + `${cap(killerClass)}\n`
    Object.values(victims).forEach(v => {
      display = display + (
        `     ${cap(v.killed)} (${cap(v.killed_class)}) x${v.count} ${v.arena ? " (Oniar)":''}`+'\n'
      );
    });
  });
});

   

    if (kills.length === 0 ){
       return `No kills found for ${cap(player)}`
    }else{
       return display
    }
}


async function getGlobalClassStats(){
    const {data} = await supabase.from('death_logs').select()
    const classes = ["alchemist", "apostate", "bard", "blademaster", "depthswalker", "druid", "infernal", "jester", 'magi', "monk", "occultist", "paladin", "pariah", "priest", "psion", "runewarden", "sentinel", "serpent", "shaman", "sylvan", "unnamable"]
    let classInfo = {}
    let display = ``
    data.forEach(e=>{
        if (!classInfo[e.killer_class]){
            classInfo[e.killer_class] = 1
        }else{
            classInfo[e.killer_class] = classInfo[e.killer_class] + 1
        }
    })

    const sortedEntries = Object.entries(classInfo).sort((a, b) => b[1] - a[1]);
    const sortedObj = Object.fromEntries(sortedEntries);

    for (const c of Object.entries(sortedObj)){
      if (classes.includes(c[0])){
        display = display + `${cap(c[0])} has ${c[1]} kills\n`
      }
    }
   return display
}


    
   setInterval(function() {
     updateDeathLogs()
    console.log('Updating KDR database...')
}, 60000); 

   setInterval(function() {
     updatePlayerDB()
    console.log('Updating Player database...hold on tight.')
}, 600000); 
 
 
updateDeathLogs()

 
// updatePlayerDB()
export {playerKillStats, newDeathLog, updatePlayerInfo, getKDR, getPlayers, getPlayerKills, getGlobalClassStats}