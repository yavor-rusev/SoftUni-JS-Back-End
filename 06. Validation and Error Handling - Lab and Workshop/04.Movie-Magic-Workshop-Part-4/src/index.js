const express = require('express');
const { configMongoose } = require('./config/mongooseConfig');
const { configHandlebars } = require('./config/handlebarsConfig');
const { configExpress } = require('./config/expressConfig');
const { configRoutes } = require('./config/routes');

const PORT = process.env.port || 3000;

async function start() {
    const app = express();
    
    await configMongoose();
    configHandlebars(app);
    configExpress(app);
    configRoutes(app);
    
    app.listen(PORT, () => {
        console.log(`Application running on port ${PORT}`);        
    });    
}

start();
