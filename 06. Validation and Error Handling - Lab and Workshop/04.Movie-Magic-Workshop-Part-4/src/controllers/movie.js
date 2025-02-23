const { Router } = require('express');
const { body, validationResult } = require('express-validator');

const { isUser } = require('../middlewares/guards');
const { parseError } = require('../utils/errorParser');
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

    // Title must be at least 5 characters long, which could be English letters, digits, and whitespaces
    body('title').trim()
        .notEmpty().withMessage('Title is required').bail()
        .matches(/^[a-zA-Z0-9 ]+$/).withMessage('Title must contain only English letters, digits and whitespaces').bail()
        .isLength({min: 5}).withMessage('Title must be at least 5 characters long')        
    ,

    // Genre must be at least 5 characters long, which could be English letters, digits, and whitespaces
    body('genre').trim()
        .notEmpty().withMessage('Genre is required').bail()
        .matches(/^[a-zA-Z0-9 ]+$/).withMessage('Genre must contain only English letters, digits and whitespaces').bail()
        .isLength({min: 5}).withMessage('Genre must be at least 5 characters long')        
    ,
    
    // Director must be at least 5 characters long, which could be English letters, digits, and whitespaces
    body('director').trim()
        .notEmpty().withMessage('Director is required').bail()
        .matches(/^[a-zA-Z0-9 ]+$/).withMessage('Director must contain only English letters, digits and whitespaces').bail()
        .isLength({min: 5}).withMessage('Director must be at least 5 characters long')        
    ,

    // Year must be between 1878 and 2100
    body('year').trim()
        .notEmpty().withMessage('Year is required').bail()
        .isInt({min: 1878, max: 2100}).withMessage('Year must be between 1878 and 2100')
    ,    

    // Movie Poster URL should start with http://... or https://...
    body('imageURL').trim()
        .notEmpty().withMessage('Movie Poster URL is required').bail()
        .matches(/^https?:\/\/.+/).withMessage('Movie Poster URL should start with http://... or https://...')             
    ,

    // Rating must be between 1 and 5
    body('rating').trim()
        .notEmpty().withMessage('Rating is required').bail()
        .isInt({min: 1, max: 5}).withMessage('Rating must be between 1 and 5')        
    ,

    // Description must be at least 20 characters, which could be English letters, digits, and whitespaces
    body('description').trim()
        .notEmpty().withMessage('Description is required').bail()
        .matches(/^[a-zA-Z0-9 ]+$/).withMessage('Description must contain only English letters, digits and whitespaces').bail()
        .isLength({min: 20}).withMessage('Director must be at least 20 characters long')        
    ,
    
    async (req, res) => {
        const inputData = req.body;        

        try {
            // Extract <result> object that express-validation has attached to <request>
            const result = validationResult(req);            

            // Check if there are any errors in <result.errors> array - throw the array if true
            if(result.errors.length) {                
                throw result.errors;
            }

            // Get logged user ID from <user> (session) property
            const authorId = req.user._id;
        
            //Add to database
            await createMovie(inputData, authorId);

        }catch(err) {
            console.log('catched create-movie error');

            // Parse generic errors, express-validator errors and mongoose errors to structure compatible with <handelbars> templates
            const errors = parseError(err);

            // Pass errors to <handelbars> layout template
            res.locals.hasErrors = errors;

            res.render('movie-create', { pageTitle: 'Create Movie', inputData, errors}); 
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