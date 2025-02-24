const { Router } = require('express');
const { body, validationResult } = require('express-validator');

const { isUser } = require('../middlewares/guards');
const { createCast } = require('../services/castService');
const { parseError } = require('../utils/errorParser');

const castRouter = Router();

castRouter.get(
    '/create/cast',
    isUser(),
    (req, res) => {
        res.render('cast-create', { pageTitle: 'Create Cast'});
    }
);

castRouter.post(
    '/create/cast',
    isUser(),

    // Name must be at least 5 characters long, which could be English letters, digits, "-" and whitespaces
    body('name').trim()
        .notEmpty().withMessage('Name is required').bail()
        .matches(/^[a-zA-Z0-9\- ]+$/).withMessage('Name must contain only English letters, digits, "-" and whitespaces').bail()
        .isLength({min: 5}).withMessage('Name must be at least 5 characters long')        
    ,

    // Age must be between 1 and 120
    body('age').trim()
        .notEmpty().withMessage('Age is required').bail()
        .isInt({min: 1, max: 120}).withMessage('Age must be between 1 and 120')
    ,

    // Born must be at least 10 characters, which could be English letters, digits, "-", "," and whitespaces
    body('born').trim()
        .notEmpty().withMessage('Born is required').bail()
        .matches(/^[a-zA-Z0-9\-, ]+$/).withMessage('Born must contain only English letters, digits, "-", "," and whitespaces').bail()
        .isLength({min: 10}).withMessage('Born must be at least 10 characters long')        
    ,

    // Name-in-movie must be at least 5 characters long, which could be English letters, digits, "-" and whitespaces
    body('nameInMovie').trim()
        .notEmpty().withMessage('Name-in-movie is required').bail()
        .matches(/^[a-zA-Z0-9\- ]+$/).withMessage('Name-in-movie must contain only English letters, digits, "-" and whitespaces').bail()
        .isLength({min: 5}).withMessage('Name-in-movie must be at least 5 characters long')        
    ,

    // Cast image  URL should start with http://... or https://...
    body('imageURL').trim()
        .notEmpty().withMessage('Cast image URL is required').bail()
        .matches(/^https?:\/\/.+/).withMessage('Cast image URL should start with http://... or https://...')             
    ,

    async (req, res) => {
        const inputData = req.body;
        
        try{
            // Extract <result> object that express-validation has attached to <request>
            const result = validationResult(req);
            
            // Check if there are any errors in <result.errors> array - throw the array if true
            if(result.errors.length) {
                throw result.errors;
            }
            //Add to database
            await createCast(inputData);

        }catch(err) {
            console.log('catched create-cast error');
            
            // Parse generic errors, express-validator errors and mongoose errors to structure compatible with <handelbars> templates
            const errors = parseError(err);

            // Pass errors to <handelbars> layout template
            res.locals.hasErrors = errors;

            res.render('cast-create', { pageTitle: 'Create Cast', inputData, errors});
            return;
        }    
                
        res.redirect('/');          
    }
);


module.exports = { castRouter}; 

