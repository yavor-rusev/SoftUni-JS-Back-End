const { Router } = require('express');
const { body, validationResult } = require('express-validator');

const { isUser } = require('../middlewares/guards');
const { getAllCast, attachMovieToCast } = require('../services/castService');
const { attachCastToMovie, removeCastFromMovie, getMovieById } = require('../services/movieService');
const { parseError } = require('../utils/errorParser');

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
    
        try{
            const movie = await getMovieById(movieId);
    
            // Check if movie exist
            if (!movie) {
                throw new Error('Movie not found');
            }

            // Check if user is author           
            const isAuthor = req.user && req.user._id === movie.author.toString();
        
            if (!isAuthor) {
                throw new Error('Access denied');                
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

        }catch(err) {
            console.log('catched attach-get error');
            
            if(err.message === 'Access denied') {
                res.redirect('/login');

            } else {
                res.render('404', { pageTitle: 'Error - ' + err.message });            
            }            
        }      
    }
);

attachRouter.post(
    '/attach/cast/:id',
    isUser(),
    body('cast').custom(value => value !== 'none').withMessage('Please select cast'),

    async (req, res) => {
        const movieId = req.params.id;
        const castId = req.body.cast;
    
        if (!movieId || !castId) {
            console.log(`Missing ${movieId} or ${castId}`);
    
            res.status(400).end();
            return;
        }

        let movie;
        
        try{
            movie = await getMovieById(movieId);

            // Check if movie exist
            if(!movie) {
                throw new Error('Movie not found');            
            }

            // Extract <result> object that express-validation has attached to <request>
            const result = validationResult(req);            

            // Check if there are any errors in <result.errors> array - throw the array if true
            if(result.errors.length) {                
                throw result.errors;
            }

            // Check if user is author          
            const isAuthor = req.user && req.user._id === movie.author.toString();

            if (!isAuthor) {
                throw new Error('Access denied');
            }             
            
            // Attach cast to movie
            await attachCastToMovie(movieId, castId);           

        }catch(err) {
            console.log('catched attach-post error');

            if(err.message === 'Access denied') {
                res.redirect('/login');

            } else if (err.message === 'Movie not found') {
                res.render('404', { pageTitle: 'Error - ' + err.message });
            
            } else{
                // Parse generic errors, express-validator errors and mongoose errors to structure compatible with <handelbars> templates
                const errors = parseError(err);

                // Pass errors to <handelbars> layout template
                res.locals.hasErrors = errors;
                
                let allCast = await getAllCast();

                //Filter only cast that are not already attached to a movie
                allCast = allCast.filter(castProxy => !!castProxy.movie === false);
        
                /*
                //Filter only cast that are not already attached to THAT movie
                const movieCastAsArrayOfStrings = movie.cast.map(cast => cast._id = cast._id.toString());
                allCast = allCast.filter(castProxy => !movieCastAsArrayOfStrings.includes(castProxy._id.toString()));
                */

                res.render('cast-attach', { pageTitle: 'Attach Cast', movie, allCast, errors });
            }

            return;
        }                    
    
        // Attach movie to cast
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