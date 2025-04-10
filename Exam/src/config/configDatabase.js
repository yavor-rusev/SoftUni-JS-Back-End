const mongoose = require('mongoose');

require('../models/User');
require('../models/Sneaker');

async function configDatabase() {
    const connectionString = 'mongodb://localhost:27017/sneakers-paradise';
    await mongoose.connect(connectionString);

    console.log('Database connected');    
}

module.exports = { configDatabase };