import express from 'express';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { cap} from './utils/index.js';
const port = process.env.PORT || 3000;
const app = express()
dotenv.config();
import { WebhookClient } from "discord.js";


const TargDeathBot = new WebhookClient({ id: process.env.WH_ID, token: process.env.WH_TOKEN });

async function Grim(killer, killed, killer_class, killed_class, arena){    
        let formattedMsg

        if (arena){
            formattedMsg = `${killed} (${cap(killed_class)}) was slain by ${killer} (${cap(killer_class)}) in Oniar.`
        }else{
            formattedMsg = `${killed} (${cap(killed_class)}) was slain by ${killer} (${cap(killer_class)})`
        }
        
            TargDeathBot.send({
            content: '```' + formattedMsg + '```',
            username: 'Grim',
            avatarURL: 'https://totym.net/cdn/shop/files/knox-the-grim-reaper-plush-3131497.png?v=1771313413&width=4200',
        });
    }


const supabase = createClient(process.env.DB_URL, process.env.DB_TOKEN )

const createServer = (client) => {
    app.get('/', async (req, res) => {

    }); 

    // Add other routes here that need access to the client
    // ...

    return app;
};

const gifAPI = process.env.gifAPI



export {createServer, port, supabase, Grim, gifAPI}