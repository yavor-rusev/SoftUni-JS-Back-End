const { Router } = require('express');
const { getRecent, getAll, getById } = require('../services/stoneService');

const catalogRouter = Router();

catalogRouter.get('/', async (req, res) => {     
    try{
        const stones = await getRecent();

        res.locals.pageTitle = 'Home';
        res.render('home', {stones});
    }catch(err){
        console.log(err.message);
        
        res.locals.pageTitle = err.message;        
        res.render('404');
    }
});

catalogRouter.get('/dashboard', async (req, res) => {         
    try{
        const stones = await getAll();
        
        res.locals.pageTitle ='Dashboard';       
        res.render('dashboard', {stones});
    }catch(err){
        console.log(err.message);
        
        res.locals.pageTitle = err.message;        
        res.render('404');
    }
});

catalogRouter.get('/details/:id', async (req, res) => { 
    const stoneId = req.params.id;
            
    try{
        const stone = await getById(stoneId);
        
        const hasUser = Boolean(req?.user);
        const isOwner = Boolean(req?.user && req.user._id === stone.owner.toString());
        const isLiked = Boolean(req?.user && stone.likedList.find(l => l.toString() == req.user._id));       
        
        
        res.locals.pageTitle = 'Details';        
        res.render('details', {stone, hasUser, isOwner, isLiked});
    }catch(err){
        console.log(err.message);

        res.locals.pageTitle = err.message;        
        res.render('404');
    }
});

catalogRouter.get('/search', async (req, res) => {     
    try{
        let stones = await getAll();

        let search = null;
        
        if(req.query.search) {
            search = req.query.search.trim();           
            stones = stones.filter(stone => stone.name.toLowerCase().startsWith(search.toLowerCase()));
        }

        res.locals.pageTitle = 'Search';        
        res.render('search', {stones, search});
    }catch(err){
        console.log(err.message);

        res.locals.pageTitle = err.message;        
        res.render('404');
    }    
});

module.exports = { catalogRouter };