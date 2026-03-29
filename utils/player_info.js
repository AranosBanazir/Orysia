import { supabase } from "../server.js";




    async function getPlayer(who){
        const {data, error} = await supabase.from('Players')
                                     .select()
                                     .eq('name', who)
        console.log(data, error)
        return data

    }

    getPlayer('Arano')