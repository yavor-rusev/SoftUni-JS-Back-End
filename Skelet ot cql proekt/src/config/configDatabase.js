const mongoose = require('mongoose');

require('../models/User');
require('../models/Stone'); //TODO add/change models

async function configDatabase() {
    const connectionString = 'mongodb://localhost:27017/earth-treasure-vault'; //TODO rename database 
    await mongoose.connect(connectionString);

    console.log('Database connected');    
}

module.exports = { configDatabase };