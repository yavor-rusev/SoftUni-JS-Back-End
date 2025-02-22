const { Router } = require('express');

const { isUser } = require('../middlewares/guards');
const { removeMovieFromCast } = require('../services/castService');
const { createMovie, getMovieById, upadateMovie, deleteMovie } = require('../services/movieService');

const movieRouter = Router();

movieRouter.get(
    '/create/movie',
    isUser(),
    (req, res) => {
        res.render('movie-create', { pageTitle: 'Create Movie' });
    }
);

movieRouter.post(
    '/create/movie',
    isUser(),
    async (req, res) => {
        const inputData = req.body;        
        
        //Set <errors> property as <true> if <inputData> is empty string (falsy value)
        const emptyFields = {
            title: !inputData.title,
            genre: !inputData.genre,
            director: !inputData.director,
            year: !inputData.year,
            imageURL: !inputData.imageURL,
            rating: !inputData.rating,
            description: !inputData.description           
            
        };
        
        const invalidValues = {
            year: false,
            rating: false,
            description: false,
            imageURL: false
        };
    
        const errorMessages = {
            hasMessage: false,
            emptyField: false,
            invalidYear: false,
            invalidRating: false,
            invalidDescription: false,
            invalidImageURL: false
        };
    
        //Check for empty fields
        if (Object.values(emptyFields).includes(true) ) {
            errorMessages.emptyField = true;
            errorMessages.hasMessage = true;        
        }
    
        //Check if years is more than 1877
        if (inputData.year !== '' && Number(inputData.year) < 1878) {            
            invalidValues.year = true;
            errorMessages.invalidYear = true;
            errorMessages.hasMessage = true;            
        }
    
        //Check if rating is between 1 and 5
        if (inputData.rating !== '' && (Number(inputData.rating) < 1 || Number(inputData.rating) > 5)) {            
            invalidValues.rating = true;
            errorMessages.invalidRating = true;
            errorMessages.hasMessage = true;
        } 
        
        //Check if description is up to 1000 characters
        if (inputData.description.length > 1000) {
            invalidValues.description = true;
            errorMessages.invalidDescription = true;
            errorMessages.hasMessage = true;
        }
        
        //Check if imageURL starts with 'http'
        if (inputData.imageURL !== '' && !inputData.imageURL.startsWith('http')) {
            invalidValues.imageURL = true;
            errorMessages.invalidImageURL = true;
            errorMessages.hasMessage = true;
        }
        
        //Check if there is any invalid value by checking if there is error message
        if(errorMessages.hasMessage) {
            res.render('movie-create', { pageTitle: 'Create Movie', inputData, emptyFields, invalidValues, errorMessages}); 
            return;
        }      
        
        // Get logged user ID from <user> (session) property
        const authorId = req.user._id;
    
        //Add to database
        try{
            await createMovie(inputData, authorId);
        }catch(err) {
            res.render('404', { pageTitle: 'Error - ' + err.message });
            return;
        }        
        
        res.redirect('/');
    }
);

movieRouter.get(
    '/edit/movie/:id',
    isUser(), 
    async (req, res) => {
        const movieId = req.params.id;
    
        if (!movieId) {
            console.log(`Missing movie ID - ${movieId}`);
    
            res.status(400).end();
            return;
        }
    
        let movieAsPlainObject; 
    
        try{
            movieAsPlainObject = await getMovieById(movieId);
    
            // Check if movie exist
            if(!movieAsPlainObject) {
                throw new Error('Movie not found');            
            }
            
        } catch(err) {
            console.log('editGet() ->', err.message);
            
            res.render('404', { pageTitle: 'Error - ' + err.message });
            return;
        }
    
        // Check if user is author           
        const isAuthor = req.user && req.user._id === movieAsPlainObject.author.toString();
    
        if (!isAuthor) {
            res.redirect('/login');
            return;
        }
    
        res.render('movie-edit', {pageTitle: 'Edit Movie', inputData: movieAsPlainObject});
    }
);

movieRouter.post(
    '/edit/movie/:id',
    isUser(),
    async(req, res) => {        
        // Get new input data
        const inputData = req.body;        
        
        // Set <errors> property as <true> if <inputData> is empty string (falsy value)
        const emptyFields = {
            title: !inputData.title,
            genre: !inputData.genre,
            director: !inputData.director,
            year: !inputData.year,
            imageURL: !inputData.imageURL,
            rating: !inputData.rating,
            description: !inputData.description            
        };
        
        const invalidValues = {
            year: false,
            rating: false,
            description: false,
            imageURL: false
        };
        
        const errorMessages = {
            hasMessage: false,
            emptyField: false,
            invalidYear: false,
            invalidRating: false,
            invalidDescription: false,
            invalidImageURL: false
        };
        
        //Check for empty fields
        if (Object.values(emptyFields).includes(true) ) {
            errorMessages.emptyField = true;
            errorMessages.hasMessage = true;        
        }
        
        //Check if years is more than 1877
        if (inputData.year !== '' && Number(inputData.year) < 1878) {            
            invalidValues.year = true;
            errorMessages.invalidYear = true;
            errorMessages.hasMessage = true;            
        }
        
        //Check if rating is between 1 and 5
        if (inputData.rating !== '' && (Number(inputData.rating) < 1 || Number(inputData.rating) > 5)) {            
            invalidValues.rating = true;
            errorMessages.invalidRating = true;
            errorMessages.hasMessage = true;
        } 
        
        //Check if description is up to 1000 characters
        if (inputData.description.length > 1000) {
            invalidValues.description = true;
            errorMessages.invalidDescription = true;
            errorMessages.hasMessage = true;
        }
        
        //Check if imageURL starts with 'http'
        if (inputData.imageURL !== '' && !inputData.imageURL.startsWith('http')) {
            invalidValues.imageURL = true;
            errorMessages.invalidImageURL = true;
            errorMessages.hasMessage = true;
        }
        
        //Check if there is any invalid value by checking if there is error message
        if(errorMessages.hasMessage) {
            res.render('movie-edit', { pageTitle: 'Edit Movie', inputData, emptyFields, invalidValues, errorMessages}); 
            return;
        }     
        
        const movieId = req.params.id;       
        
        if (!movieId) {
            console.log(`Missing movie ID - ${movieId}`);
        
            res.status(400).end();
            return;
        }  
            
        // Get logged user ID from <user> (session) property
        const userId = req.user._id;       
        
        try{
            // Update movie in database
            await upadateMovie(movieId, inputData, userId);
    
        } catch(err) {
            if(err.message === 'Access denied') {
                res.redirect('/login');
            } else {
                res.render('404', { pageTitle: 'Error - ' + err.message });
            }
            return;
        }
    
        res.redirect('/details/' + movieId);        
    }
);

movieRouter.get(
    '/delete/movie/:id',
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
            if(!movie) {
                throw new Error('Movie not found');            
            }
            
        } catch(err) {
            console.log('deleteGet() ->', err.message);
            
            res.render('404', { pageTitle: 'Error - ' + err.message });
            return;
        }
    
        // Check if user is author           
        const isAuthor = req.user && req.user._id === movie.author.toString();
    
        if (!isAuthor) {
            res.redirect('/login');
            return;
        }
    
        res.render('movie-delete', {pageTitle: 'Delete Movie', movie});
    
    }
);

movieRouter.post(
    '/delete/movie/:id',
    isUser(),
    async (req, res) => {
        const movieId = req.params.id;       
        
        if (!movieId) {
            console.log(`Missing movie ID - ${movieId}`);
        
            res.status(400).end();
            return;
        }  
            
        // Get logged user ID from <user> (session) property
        const userId = req.user._id;       
        
        try{
            // Remove movie from associated casts before deleting movie            
            await removeMovieFromCast(movieId, userId);            
            
            // Delete movie from database
            await deleteMovie(movieId, userId);
    
        } catch(err) {
            if(err.message === 'Access denied') {
                res.redirect('/login');            
            }else {
                res.render('404', { pageTitle: 'Error - ' + err.message });
            }
            return;
        }        
    
        res.redirect('/');        
    }
);


module.exports = { movieRouter };