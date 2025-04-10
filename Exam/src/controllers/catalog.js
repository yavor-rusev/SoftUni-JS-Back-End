const { Router } = require('express');
const { getRecent, getAll, getById, getMyRecords, getPreferred } = require('../services/sneakerService');
const { isUser } = require('../middlewares/guards');

const catalogRouter = Router();

catalogRouter.get('/', async (req, res) => {     
    try{
        const sneakers = await getRecent();

        res.locals.pageTitle = 'Home';
        res.render('home', {sneakers});
    }catch(err){
        console.log(err.message);
        
        res.locals.pageTitle = err.message;        
        res.render('404');
    }
});

catalogRouter.get('/about', (req, res) => {     
    res.locals.pageTitle = 'About';
    res.render('about');
});


catalogRouter.get('/catalog', async (req, res) => {  
    try{
        const sneakers = await getAll();
        
        res.locals.pageTitle ='Catalog';       
        res.render('catalog', {sneakers});
    }catch(err){
        console.log(err.message);
        
        res.locals.pageTitle = err.message;        
        res.render('404');
    }
});

catalogRouter.get('/details/:id', async (req, res) => {   
    
    const sneakerId = req.params.id;
            
    try{
        const sneaker = await getById(sneakerId);
        
        const hasUser = Boolean(req?.user);
        const isOwner = Boolean(req?.user && req.user._id === sneaker.owner.toString());
        const isPreferred = Boolean(req?.user && sneaker.preferredList.find(id => id.toString() == req.user._id));       
        
        res.locals.pageTitle = 'Details';        
        res.render('details', {sneaker, hasUser, isOwner, isPreferred});
    }catch(err){
        res.locals.pageTitle = err.message;        
        res.render('404');
    }
});


catalogRouter.get('/profile', 
    isUser(),
    async (req, res) => {  
        try{
            const user = req.user;
            const mySneakers = await getMyRecords(req.user._id);
            const preferredSneakers = await getPreferred(req.user._id);
            
            res.locals.pageTitle ='Profile';       
            res.render('profile', {user, mySneakers, preferredSneakers});
        }catch(err){
            console.log(err.message);
            
            res.locals.pageTitle = err.message;        
            res.render('404');
        }
    }
);





module.exports = { catalogRouter };