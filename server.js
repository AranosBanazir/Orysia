import express from 'express';
import dotenv from 'dotenv';
const port = process.env.PORT || 3000;
const app = express()
dotenv.config();




const createServer = (client) => {
    app.get('/', (req, res) => {
        res.send(`${client.user.username} says hello!`);
    });

    // Add other routes here that need access to the client
    // ...

    return app;
};


export {createServer, port}