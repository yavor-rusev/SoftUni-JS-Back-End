const { MovieModel } = require('../models/Movie');

async function getAllMovies() {
    const moviesAsPlainObjects = await MovieModel.find().lean();    

    return moviesAsPlainObjects;
}

async function getMovieById(id) {
    const movieAsPlainObject = await MovieModel.findById(id).lean().populate('cast');   

    return movieAsPlainObject;
}

async function createMovie(movieData) {
    const movieProxy = new MovieModel({
        title: movieData.title,
        genre: movieData.genre,
        director: movieData.director,
        year: Number(movieData.year),
        rating: Number(movieData.rating),
        description: movieData.description,
        imageURL: movieData.imageURL
    });

    await movieProxy.save();
    
    return movieProxy;
}

async function attachCastToMovie(movieId, castId) {
    const movieProxy = await MovieModel.findById(movieId);   

    //Check if cast is already attached to this movie
    if (!movieProxy.cast.includes(castId)) {
        movieProxy.cast.push(castId);
        await movieProxy.save();
    } else {
        console.log('This cast is already attached to the movie');
        return movieProxy;    
    }    

    return movieProxy;
}

async function removeCastFromMovie(movieId, castId) {
    const movieProxy = await MovieModel.findById(movieId);
    
    const castIndex = movieProxy.cast.indexOf(castId);

    if(castIndex !== -1) {        
        movieProxy.cast.splice(castIndex, 1);
        await movieProxy.save();        
    } else {
        console.log('Cast does not exist in this movie');
        return movieProxy;
    }

    return movieProxy;    
}


module.exports = {
    getAllMovies,
    getMovieById,
    createMovie,
    attachCastToMovie,
    removeCastFromMovie
};