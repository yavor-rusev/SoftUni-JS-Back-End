const { Router } = require('express');
const { body, validationResult } = require('express-validator');

const { isUser } = require('../middlewares/guards');
const { errorParser } = require('../utils/errorParser');
const { create, getById, editById, deleteById, prefer} = require('../services/sneakerService');

const sneakerRouter = Router();

sneakerRouter.get('/create',
    isUser(),   

    (req, res) => {        
        res.locals.pageTitle = 'Create';        
        res.render('create');
    }
);

sneakerRouter.post('/create', 
    isUser(),

    body('brand').trim().isLength({min: 3}).withMessage('Brand should be at least 3 characters long'),
    body('model').trim().isLength({min: 5}).withMessage('Model should be at least 5 characters long'),
    body('price').isInt({ gt: 0 }).withMessage('Price should be positive number'),
    body('condition').trim().isLength({min: 3}).withMessage('Condition should be at least 3 characters long'),
    body('year').isInt({ min: 1000, max: 9999 }).withMessage('Year should be exactly 4 characters long'),
    body('size').isInt({ gt: 0 }).withMessage('Size should be positive number'),
    body('image').trim().notEmpty().matches(/^https?:\/\/.+/).withMessage('Invalid URL protocol'),
    body('description').trim().isLength({min: 10, max: 150}).withMessage('Description should be between 10 and 150 characters long'),

        
    async (req, res) => {

        const data = req.body;

        try{
            const validation = validationResult(req);
            
            if(validation.errors.length) {
                throw validation.errors;
            }
            
            await create(data, req.user._id);

            res.redirect('/catalog');

        }catch(err) {
            const error = errorParser(err);

            res.locals.pageTitle = 'Create';        
            res.render('create', { data, errors: error.errors });
        }
    }
);

sneakerRouter.get('/edit/:id',
    isUser(),    
    async (req, res) => {       

        const sneakerId = req.params.id;
            
        try{
            const sneaker = await getById(sneakerId);
            
            if(sneaker.owner.toString() != req.user._id) {
                throw new Error('Access denied');
            }
            
            res.locals.pageTitle = 'Edit';        
            res.render('edit', {sneaker});
        }catch(err){
            console.log(err.message);

            res.locals.pageTitle = err.message;        
            res.render('404');
        }         
    }
);

sneakerRouter.post('/edit/:id', 
    isUser(),
    body('brand').trim().isLength({min: 3}).withMessage('Brand should be at least 3 characters long'),
    body('model').trim().isLength({min: 5}).withMessage('Model should be at least 5 characters long'),
    body('price').isInt({ gt: 0 }).withMessage('Price should be positive number'),
    body('condition').trim().isLength({min: 3}).withMessage('Condition should be at least 3 characters long'),
    body('year').isInt({ min: 1000, max: 9999 }).withMessage('Year should be exactly 4 characters long'),
    body('size').isInt({ gt: 0 }).withMessage('Size should be positive number'),
    body('image').trim().notEmpty().matches(/^https?:\/\/.+/).withMessage('Invalid URL protocol'),
    body('description').trim().isLength({min: 10, max: 150}).withMessage('Description should be between 10 and 150 characters long'),

    async (req, res) => {       

        const data = req.body;
        
        try{
            const validation = validationResult(req);
            
            if(validation.errors.length) {
                throw validation.errors;
            }

            const sneakerId = req.params.id;
            const userId = req.user._id;

            await editById(sneakerId, userId, data);

            res.redirect('/details/' + sneakerId);

        }catch(err) {
            const error = errorParser(err);
            
            res.locals.pageTitle = 'Edit';        
            res.render('edit', { sneaker: data, errors: error.errors });
        }
    }
);

sneakerRouter.get('/delete/:id',  

    isUser(),    
    async (req, res) => {
        const sneakerId = req.params.id;
        const userId = req.user._id;

        try{
            await deleteById(sneakerId, userId);

            res.redirect('/catalog');
        } catch(err) {
            console.log(err.message);

            res.locals.pageTitle = err.message;        
            res.render('404');
        }    
    }
);

sneakerRouter.get('/prefer/:id', 
    isUser(),    
    async (req, res) => {

        const sneakerId = req.params.id;
        const userId = req.user._id;

        try{
            await prefer(sneakerId, userId);

            res.redirect('/details/' + sneakerId);
        } catch(err) {
            console.log(err.message);
            
            res.locals.pageTitle = err.message;            
            res.render('404');
        }    
    }
);

module.exports = { sneakerRouter };