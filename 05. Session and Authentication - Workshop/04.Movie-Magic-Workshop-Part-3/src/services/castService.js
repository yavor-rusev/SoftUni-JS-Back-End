const { CastModel } = require('../models/Cast');
const { MovieModel } = require('../models/Movie');

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

async function removeMovieFromCast(movieId, userId) {
    const movie = await MovieModel.findById(movieId);

    if(!movie) {
        throw new Error('Movie not found');
    }

    if(movie.author.toString() !== userId) {
        throw new Error('Access denied');
    }
    
    try{
        await CastModel.updateMany({ movie: movieId }, {$unset: { movie: '' } });
    }catch(err) {
        console.log('removeMovieFromCast() error ->', err.message);
        throw new Error('Failed to remove movie from cast before deleting movie');       
    }
}

module.exports = {
    getAllCast,
    createCast,
    attachMovieToCast,
    removeMovieFromCast
};