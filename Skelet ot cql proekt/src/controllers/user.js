const { Router } = require('express');
const { isGuest, isUser } = require('../middlewares/guards');
const { body, validationResult } = require('express-validator');

const { register, login } = require('../services/userService');
const { createToken } = require('../services/jwtService');
const { errorParser } = require('../utils/errorParser');

const userRouter = Router();

userRouter.get('/register',
    isGuest(),
    (req, res) => {
        res.locals.pageTitle = 'Register';
        res.render('register');
    }
);

userRouter.post('/register',
    isGuest(),
    // TODO add/change field validations if needed

    body('email').trim().notEmpty().isEmail().isLength({min: 10}).withMessage('Email should be at least 10 characters'),
    // TODO more detailed validations if needed
    //     .notEmpty().withMessage('Email is required').bail()
    //     .matches(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/).withMessage('Email must contain only English letters, digits and "."').bail()
    //     .isEmail().withMessage('Incorrect email format').bail()
    //     .isLength({min: 10}).withMessage('Email must be at least 10 characters long').bail()
    //     .normalizeEmail()

    body('password').trim().notEmpty().isLength({min: 4}).withMessage('Password should be at least 4 characters long'),
    
    // TODO more detailed validations if needed
    //     .notEmpty().withMessage('Password is required').bail()
    //     .isAlphanumeric().withMessage('Password must contain only English letters and digits').bail()
    //     .isLength({min: 6}).withMessage('Password must be at least 6 characters long')        
    
    
    body('repass').trim().custom((value, { req }) => value === req.body.password).withMessage('Passwords don\'t match'),
    
    // TODO more detailed validations if needed
    //     .notEmpty().withMessage('Repeat-Password is required').bail()
    //     .custom((value, { req }) => value === req.body.password).withMessage('Passwords don\'t match')
    
    async (req, res) => {
        //TODO add/rename params and change redirect path if needed

        const { email, password } = req.body;
       
        try{            
            const validation = validationResult(req);

            if(validation.errors.length) {
                throw validation.errors;
            }

            const result = await register(email, password);
            const token = createToken(result);

            res.cookie('token', token);

            res.redirect('/');

        }catch(err) {
            const error = errorParser(err);

            res.locals.pageTitle = 'Register';
            res.render('register', { data: { email }, errors: error.errors });
        }
    }
);

userRouter.get('/login', 
    isGuest(),
    (req, res) => {
        res.locals.pageTitle = 'Login';
        res.render('login');    
    }
);

userRouter.post('/login',
    isGuest(), 
    // TODO add/change field validations if needed

    body('email').trim().notEmpty().isEmail().isLength({min: 10}).withMessage('Email should be at least 10 characters'),
    // TODO more detailed validations if needed
    //     .notEmpty().withMessage('Email is required').bail()
    //     .matches(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/).withMessage('Email must contain only English letters, digits and "."').bail()
    //     .isEmail().withMessage('Incorrect email format').bail()
    //     .isLength({min: 10}).withMessage('Email must be at least 10 characters long').bail()
    //     .normalizeEmail()

    body('password').trim().notEmpty().isLength({min: 4}).withMessage('Password should be at least 4 characters long'),
    // TODO more detailed validations if needed
    //     .notEmpty().withMessage('Password is required').bail()
    //     .isAlphanumeric().withMessage('Password must contain only English letters and digits').bail()
    //     .isLength({min: 6}).withMessage('Password must be at least 6 characters long')        
        
    async (req, res) => {
        //TODO add/rename params and change redirect path if needed
        
        const { email, password } = req.body;

        try{            
            const validation = validationResult(req);

            if(validation.errors.length) {
                throw validation.errors;
            }

            const result = await login(email, password);
            const token = createToken(result);

            res.cookie('token', token);

            res.redirect('/');

        }catch(err) {
            const error = errorParser(err);

            res.locals.pageTitle = 'Login';
            res.render('login', { data: { email }, errors: error.errors });
        }
    }
);

userRouter.get('/logout',
    isUser(),
    
    //TODO change redirect path if needed
    
    (req, res) => {
        res.clearCookie('token');
        res.redirect('/');
    }
);

module.exports = { userRouter };