const mongoose = require('mongoose');

//TODO add/change models
//TODO rename database

require('../models/User');
require('../models/Data');

async function configDatabase() {
    const connectionString = 'mongodb://localhost:27017/exam-db'; 
    await mongoose.connect(connectionString);

    console.log('Database connected');    
}

module.exports = { configDatabase };