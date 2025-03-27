const express = require('express');
const { configDatabase } = require('./config/configDatabase');
const { configExpress } = require('./config/configExpress');
const { configHandlebars } = require('./config/configHandlebars');
const { configRoutes } = require('./config/configRoutes');

start();

async function start() {
    const app = express();

    await configDatabase();
    configExpress(app);
    configHandlebars(app);
    configRoutes(app);
    
    app.listen(3000, () => console.log('Server listen on http://localhost:3000'));
}