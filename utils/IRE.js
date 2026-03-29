
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



export {fetchIRE, getClass, getOnline}