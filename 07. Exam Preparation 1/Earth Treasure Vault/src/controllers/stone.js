const { Router } = require('express');
const { body, validationResult } = require('express-validator');

const { isUser } = require('../middlewares/guards');
const { errorParser } = require('../utils/errorParser');
const { createStone, getById, editById, deleteById, like } = require('../services/stoneService');

const stoneRouter = Router();

stoneRouter.get('/create',
    isUser(), 
    (req, res) => {        
        res.locals.pageTitle = 'Create';        
        res.render('create');
    }
);

stoneRouter.post('/create', 
    isUser(),
    body('name').trim().isLength({min: 2}).withMessage('Name should be at least 2 characters'),
    body('category').trim().isLength({min: 3}).withMessage('Category should be at least 3 characters'),
    body('color').trim().isLength({min: 2}).withMessage('Color should be at least 2 characters'),
    body('image').trim().matches(/^https?:\/\/.+/).withMessage('Stone Image should start with http:// or https://'),
    body('location').trim().isLength({min: 5, max: 15}).withMessage('Location should be between 5 and 15 characters'),
    body('formula').trim().isLength({min: 3, max: 30}).withMessage('Formula should be between 3 and 30 characters'),
    body('description').trim().isLength({min: 10}).withMessage('Description should be a minimum of 10 characters long'),

    async (req, res) => {        
        const data = req.body;

        try{
            const validation = validationResult(req);
            
            if(validation.errors.length) {
                throw validation.errors;
            }
            
            await createStone(data, req.user._id);

            res.redirect('/dashboard');

        }catch(err) {
            const error = errorParser(err);

            res.locals.pageTitle = 'Create';        
            res.render('create', { data, errors: error.errors });
        }
    }
);

stoneRouter.get('/edit/:id', 
    isUser(),    
    async (req, res) => {
        const stoneId = req.params.id;
            
        try{
            const stone = await getById(stoneId);
            
            if(stone.owner.toString() != req.user._id) {
                throw new Error('Access denied');
            }
            
            res.locals.pageTitle = 'Edit';        
            res.render('edit', {stone});
        }catch(err){
            console.log(err.message);

            res.locals.pageTitle = err.message;        
            res.render('404');
        }         
    }
);

stoneRouter.post('/edit/:id', 
    isUser(),
    body('name').trim().isLength({min: 2}).withMessage('Name should be at least 2 characters'),
    body('category').trim().isLength({min: 3}).withMessage('Category should be at least 3 characters'),
    body('color').trim().isLength({min: 2}).withMessage('Color should be at least 2 characters'),
    body('image').trim().matches(/^https?:\/\/.+/).withMessage('Stone Image should start with http:// or https://'),
    body('location').trim().isLength({min: 5, max: 15}).withMessage('Location should be between 5 and 15 characters'),
    body('formula').trim().isLength({min: 3, max: 30}).withMessage('Formula should be between 3 and 30 characters'),
    body('description').trim().isLength({min: 10}).withMessage('Description should be a minimum of 10 characters long'),
    async (req, res) => {        
        const data = req.body;
        
        try{
            const validation = validationResult(req);
            
            if(validation.errors.length) {
                throw validation.errors;
            }

            const stoneId = req.params.id;
            const userId = req.user._id;

            await editById(stoneId, userId, data);

            res.redirect('/dashboard');

        }catch(err) {
            const error = errorParser(err);
            
            res.locals.pageTitle = 'Edit';        
            res.render('edit', { stone: data, errors: error.errors });
        }
    }
);

stoneRouter.get('/delete/:id', 
    isUser(),    
    async (req, res) => {
        const stoneId = req.params.id;
        const userId = req.user._id;

        try{
            await deleteById(stoneId, userId);

            res.redirect('/dashboard');
        } catch(err) {
            console.log(err.message);

            res.locals.pageTitle = err.message;        
            res.render('404');
        }    
    }
);

stoneRouter.get('/like/:id', 
    isUser(),    
    async (req, res) => {
        const stoneId = req.params.id;
        const userId = req.user._id;

        try{
            await like(stoneId, userId);

            res.redirect('/details/' + stoneId);
        } catch(err) {
            console.log(err.message);
            
            res.locals.pageTitle = err.message;            
            res.render('404');
        }    
    }
);

module.exports = { stoneRouter };