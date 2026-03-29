import express from 'express';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { fetchIRE } from './utils/IRE.js';
const port = process.env.PORT || 3000;
const app = express()
dotenv.config();


const supabase = createClient(process.env.DB_URL, process.env.DB_TOKEN )

const createServer = (client) => {
    app.get('/', async (req, res) => {

    }); 

    // Add other routes here that need access to the client
    // ...

    return app;
};





export {createServer, port, supabase}