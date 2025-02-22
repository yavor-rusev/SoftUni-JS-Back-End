const { Router } = require('express');
const { body, validationResult } = require('express-validator');

const { isGuest, isUser } = require('../middlewares/guards');
const { register, login } = require('../services/userService');
const { createToken } = require('../services/tokenService');
const { parseError } = require('../utils/errorParser');

const userRouter = Router();

userRouter.get(
    '/register', 
    isGuest(),
    async (req, res) => {
        res.render('register', { pageTitle: 'Register' });
    }
);

userRouter.post(
    '/register',
    isGuest(),

    //Email should end in @x.x, where x is one or more English letters/digits and should be at least 10 characters long
    body('email').trim()
        .notEmpty().withMessage('Email is required').bail()
        .matches(/^[a-zA-Z0-9@.]+$/).withMessage('Email must contain only English letters and digits').bail()
        .isEmail().withMessage('Incorrect email format').bail()
        .isLength({min: 10}).withMessage('Email must be at least 10 characters long')        
    ,

    //Password should consist only of English letters and digits, ans should be at least 6 characters long 
    body('password').trim()
        .notEmpty().withMessage('Password is required').bail()
        .isAlphanumeric().withMessage('Password must contain only English letters and digits').bail()
        .isLength({min: 6}).withMessage('Password must be at least 6 characters long')        
    ,

    //Repeated password	should be the same as the given password 
    body('repass').trim()
        .notEmpty().withMessage('Repeat-Password is required').bail()
        .custom((value, { req }) => value === req.body.password).withMessage('Passwords don\'t match')
    ,

    async (req, res) => {
        const {email, password} = req.body;        
        
        try {
            // Extract <result> object that express-validation has attached to <request>
            const result = validationResult(req);            

            // Check if there are any errors in <result.errors> array - throw the array if true
            if(result.errors.length) {                
                throw result.errors;
            }

            // Create user record
            const user = await register(email, password);

            // Create user token
            const token = createToken(user);            

            // Send token-cookie to client
            res.cookie('token', token, {httpOnly: true});

            res.redirect('/'); 

        }catch(err) {
            console.log('catched register error');
            
            // Parse generic errors, express-validator errors and mongoose errors to structure compatible with <handelbars> templates
            const errors = parseError(err);

            // Pass errors to <handelbars> layout template
            res.locals.hasErrors = errors;              
            
            res.render('register', { pageTitle: 'Register', inputData: { email }, errors});
            return;
        }        

    }
);

userRouter.get(
    '/login', 
    isGuest(),
    async (req, res) => {
        res.render('login', { pageTitle: 'Login' });
    }
);

userRouter.post(
    '/login',
    isGuest(),
    async (req, res) => {        
        const {email, password} = req.body;
    
        try{
            //Validate input data
            if(!email || !password) {
                throw new Error('All fields are requiered!');
            }
    
            // Get authenticated user or throw error
            const user = await login(email, password);
    
            // Create user token
            const token = createToken(user);
    
            // Send token-cookie to client
            res.cookie('token', token, {httpOnly: true});
    
            res.redirect('/');
    
        } catch(err) {
            console.log('catched login error ->', err.message);
    
            res.render('login', { pageTitle: 'Login', inputData: { email }, errorMessage: err.message});
            return;
        }        
    }
);

userRouter.get(
    '/logout',
    isUser(),
    (req, res) => {
        // clear token-cookie
        res.clearCookie('token');    
        res.redirect('/');
    }
);

module.exports = { userRouter };