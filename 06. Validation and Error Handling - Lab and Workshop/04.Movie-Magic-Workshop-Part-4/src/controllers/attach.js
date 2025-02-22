const { Router } = require('express');

const { isUser } = require('../middlewares/guards');
const { getAllCast, attachMovieToCast } = require('../services/castService');
const { attachCastToMovie, removeCastFromMovie, getMovieById } = require('../services/movieService');

const attachRouter = Router();

attachRouter.get(
    '/attach/cast/:id',
    isUser(),
    async (req, res) => {
        const movieId = req.params.id;
    
        if (!movieId) {
            console.log(`Missing movie ID - ${movieId}`);
    
            res.status(400).end();
            return;
        }
    
        let movie;
    
        try{
            movie = await getMovieById(movieId);
    
            // Check if movie exist
            if (!movie) {
                throw new Error('Movie not found');
            }
    
        }catch(err) {
            console.log('attachGet() ->', err.message);
    
            res.render('404', { pageTitle: 'Error - ' + err.message });
            return;
        }
        
        // Check if user is author           
        const isAuthor = req.user && req.user._id === movie.author.toString();
    
        if (!isAuthor) {
            res.redirect('/login');
            return;
        }
    
        let allCast = await getAllCast();
    
        //Filter only cast that are not already attached to a movie
        allCast = allCast.filter(castProxy => !!castProxy.movie === false);
    
        /*
        //Filter only cast that are not already attached to THAT movie
        const movieCastAsArrayOfStrings = movie.cast.map(cast => cast._id = cast._id.toString());
        allCast = allCast.filter(castProxy => !movieCastAsArrayOfStrings.includes(castProxy._id.toString()));
        */
    
        res.render('cast-attach', { pageTitle: 'Attach Cast', movie, allCast });
    }
);

attachRouter.post(
    '/attach/cast/:id',
    isUser(),
    async (req, res) => {
        const movieId = req.params.id;
        const castId = req.body.cast;
    
        if (!movieId || !castId) {
            console.log(`Missing ${movieId} or ${castId}`);
    
            res.status(400).end();
            return;
        }       
    
        let emptyCast = false;
    
        if (castId === 'none') {
            emptyCast = true;
    
            let movie;
    
            try{
                movie = await getMovieById(movieId);
    
                // Check if movie exist
                if(!movie) {
                    throw new Error('Movie not found');            
                }
    
                // Check if user is author          
                const isAuthor = req.user && req.user._id === movie.author.toString();
    
                if (!isAuthor) {
                    res.redirect('/login');
                    return;
                }
    
            }catch(err) {
                console.log('attachPost() ->', err.message);
                
                res.render('404', { pageTitle: 'Error - ' + err.message });
                return;
            }          
    
            let allCast = await getAllCast();
    
            //Filter only cast that are not already attached to a movie
            allCast = allCast.filter(castProxy => !!castProxy.movie === false);
    
            /*
            //Filter only cast that are not already attached to THAT movie
            const movieCastAsArrayOfStrings = movie.cast.map(cast => cast._id = cast._id.toString());
            allCast = allCast.filter(castProxy => !movieCastAsArrayOfStrings.includes(castProxy._id.toString()));
            */
    
            res.render('cast-attach', { pageTitle: 'Attach Cast', movie, allCast, emptyCast });
            return;
        }
    
        // Get logged user ID from <user> (session) property
        const userId = req.user._id; 
    
        try {            
            await attachCastToMovie(movieId, castId, userId);         
    
        } catch (err) {
            console.log(`Failed to add cast to movie --> ${err.message}`);            
    
            if(err.message === 'Access denied') {
                res.redirect('/login');
            } else {
                res.render('404', { pageTitle: 'Error - ' + err.message });
            }
    
            return;
        }
    
        try {
            await attachMovieToCast(castId, movieId);
    
        } catch (err) {
            console.log(`Failed to add movie to cast --> ${err}`);
    
            //Delete cast that is already added to <cast> array of the movie
            await removeCastFromMovie(movieId, castId);                                   
    
            res.render('404', { pageTitle: 'Error - ' + err.message });
    
            return;
        }
    
        res.redirect('/details/' + movieId);
    }
);


module.exports = { attachRouter };