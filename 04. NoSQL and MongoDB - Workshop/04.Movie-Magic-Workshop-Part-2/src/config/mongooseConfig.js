const mongoose = require('mongoose');
require('../models/Cast');
require('../models/Movie');

async function configMongoose() {    
    const connectionString = 'mongodb://localhost:27017/movie-magic';
    await mongoose.connect(connectionString);

    console.log('Database connected');
};

module.exports = {
    configMongoose
};