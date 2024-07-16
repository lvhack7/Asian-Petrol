const express = require('express');
const routes = require('./routes');
const db = require('./db.js')
const cors = require('cors')

const app = express();
const PORT = 5500;

app.use(cors())
app.use(express.json());

app.use('/api', routes);

async function startServer() { 
    try {
        await db.authenticate();
        await db.sync()
        console.log('Connection has been established successfully.');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}


startServer()