import 'dotenv/config'; 
import express from 'express';
import logger from 'morgan';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import pool from './db.js';
import { initDatabase } from './initDb.js';

const port = process.env.PORT ?? 3000;

const app = express();
const server = createServer(app);
const io = new Server(server);

await initDatabase();

io.on('connection', async (socket) => {
    console.log('a user has connected!');

    const serverOffset = socket.handshake.auth.serverOffset ?? 0;

    socket.on('disconnect', () => {
        console.log("an user has disconnected");
    }); 

    socket.on('chat message', async (message) => {
        console.log('message: ' + message);
        let result;
        try {
            //result = await pool.query('INSERT INTO messages (content) VALUES ($1)', [message]);
            result = await pool.query(
                'INSERT INTO messages (content) VALUES ($1) RETURNING id',
                [message]
            );
            const insertedId = result.rows[0].id;
            io.emit('chat message', message, insertedId);
        } catch (error) {
            console.error('❌ Error al guardar mensaje:', error);
            return
        }
    });

    if (!socket.recovered) {
        try {
            const results = await pool.query(
                'SELECT id, content FROM messages WHERE id > $1 ORDER BY id ASC', 
                [serverOffset]
            )
            for (const row of results.rows) {
                socket.emit('chat message', row.content, row.id);
            }
        } catch (error) {
            console.error(error)
        }
    }

}); 

app.use(logger("dev"));
 
app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/client/index.html');
}); 

server.listen(port, () =>{
    console.log(`Servidor escuchando en el puerto ${port}`);
}); 