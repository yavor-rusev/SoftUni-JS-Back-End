const express = require('express');
const {configMongoose} = require('./config/mongooseConfig');
const {configHandlebars} = require('./config/handlebarsConfig');
const {configExpress} = require('./config/expressConfig');
const {router} = require('./config/routes');

const PORT = process.env.port || 3000;

async function start() {
    const app = express();
    
    await configMongoose();
    configHandlebars(app);
    configExpress(app);
    app.use(router);
    
    app.listen(PORT, () => {
        console.log(`Application running on port ${PORT}`);        
    });    
}

start();
