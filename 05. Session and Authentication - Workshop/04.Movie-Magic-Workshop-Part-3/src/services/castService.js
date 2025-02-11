const { CastModel } = require('../models/Cast');

async function getAllCast() {
    const castAsPlainObjects = await CastModel.find().lean();
    
    return castAsPlainObjects;
}

async function createCast(castData) {
    const castProxy = new CastModel({
        name: castData.name,
        age: Number(castData.age),
        born: castData.born,
        nameInMovie: castData.nameInMovie,
        imageURL: castData.imageURL
    });

    await castProxy.save();

    return castProxy;
}

async function attachMovieToCast(castId, movieId) {
    const castProxy = await CastModel.findById(castId);
    castProxy.movie = movieId;
    await castProxy.save();

    return castProxy;
}


module.exports = {
    getAllCast,
    createCast,
    attachMovieToCast
};