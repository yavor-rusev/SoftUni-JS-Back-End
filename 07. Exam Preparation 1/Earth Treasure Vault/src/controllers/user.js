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
    body('email').trim().notEmpty().isEmail().isLength({min: 10}).withMessage('Email should be at least 10 characters'),
    body('password').trim().notEmpty().isLength({min: 4}).withMessage('Password should be at least 4 characters long'),
    body('repass').trim().custom((value, { req }) => value === req.body.password).withMessage('Passwords don\'t match'),
    
    async (req, res) => {
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
    body('email').trim().notEmpty().isEmail().isLength({min: 10}).withMessage('Email should be at least 10 characters'),
    body('password').trim().notEmpty().isLength({min: 4}).withMessage('Password should be at least 4 characters long'),
    async (req, res) => {
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
    (req, res) => {
        res.clearCookie('token');
        res.redirect('/');
    }
);

module.exports = { userRouter };