const express = require('express');
const {configHandlebars} = require('./config/handlebarsConfig');
const {configExpress} = require('./config/expressConfig');
const {router} = require('./config/routes');

const PORT = process.env.port || 3000;
const app = express();

configHandlebars(app);
configExpress(app);
app.use(router);

app.listen(PORT);
