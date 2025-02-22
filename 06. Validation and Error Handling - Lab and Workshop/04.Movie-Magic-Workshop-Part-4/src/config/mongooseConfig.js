const mongoose = require('mongoose');
require('../models/Cast');
require('../models/Movie');
require('../models/User');

// For movies migration
// const { UserModel } = require('../models/User');
// const { MovieModel } = require('../models/Movie');

async function configMongoose() {    
    const connectionString = 'mongodb://localhost:27017/movie-magic';
    await mongoose.connect(connectionString);

    console.log('Database connected');

    // await migrateMovies();
    // console.log('Movies are migrated');
};


// async function migrateMovies() {
//     const firstUser = await UserModel.findOne();

//     await MovieModel.updateMany({}, { $set: { author: firstUser._id }});

// 67a78bd714fb0cfcd168acc4
// }

module.exports = {
    configMongoose
};