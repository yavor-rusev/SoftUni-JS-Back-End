const { MovieModel } = require('../models/Movie');

async function getAllMovies() {
    const moviesAsPlainObjects = await MovieModel.find().lean();    

    return moviesAsPlainObjects;
}

async function getMovieById(id) {
    const movieAsPlainObject = await MovieModel.findById(id).lean().populate('cast');   

    return movieAsPlainObject;
}

async function createMovie(movieData, authorId) {
    const movieProxy = new MovieModel({
        title: movieData.title,
        genre: movieData.genre,
        director: movieData.director,
        year: Number(movieData.year),
        rating: Number(movieData.rating),
        description: movieData.description,
        imageURL: movieData.imageURL,
        author: authorId
    });

    await movieProxy.save();
    
    return movieProxy;
}

async function upadateMovie(movieId, movieData, userId) {
    const movie = await MovieModel.findById(movieId);

    if(!movie) {
        throw new Error('Movie not found');
    }

    if(movie.author.toString() !== userId) {
        throw new Error('Access denied');
    }

    movie.title = movieData.title;
    movie.genre = movieData.genre;
    movie.director = movieData.director;
    movie.year = Number(movieData.year);
    movie.imageURL = movieData.imageURL;
    movie.rating = Number(movieData.rating);
    movie.description = movieData.description;

    await movie.save();    
    
    return movie;
}

async function deleteMovie(movieId, userId) {
    const movie = await MovieModel.findById(movieId);

    if(!movie) {
        throw new Error('Movie not found');
    }

    if(movie.author.toString() !== userId) {
        throw new Error('Access denied');
    }

    await MovieModel.findByIdAndDelete(movieId);
}

async function attachCastToMovie(movieId, castId) {
    const movieProxy = await MovieModel.findById(movieId);
    
    if(!movieProxy) {
        throw new Error('Movie not found');
    }

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
    
    if(!movieProxy) {
        throw new Error(`Movie ${movieId} not found by removeCastFromMovie()`);
    }    

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
    upadateMovie,
    deleteMovie,
    attachCastToMovie,
    removeCastFromMovie
};