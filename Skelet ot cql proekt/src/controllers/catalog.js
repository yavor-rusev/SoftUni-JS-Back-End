const { Router } = require('express');
const { getRecent, getAll, getById } = require('../services/stoneService');

const catalogRouter = Router();

catalogRouter.get('/', async (req, res) => {     
    try{
        //TODO rename params, template and pageTitle 
        //TODO add/change logic if needed

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
    //TODO set guard if needed

    try{
        //TODO rename params, template and pageTitle 
        //TODO add/change logic if needed

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
    //TODO set guard if needed
    //TODO rename params, template and pageTitle 
    //TODO add/change logic if needed
    
    const stoneId = req.params.id;
            
    try{
        const stone = await getById(stoneId);
        
        const hasUser = Boolean(req?.user);
        const isOwner = Boolean(req?.user && req.user._id === stone.owner.toString());
        const isLiked = Boolean(req?.user && stone.likedList.find(l => l.toString() == req.user._id));       
        
        // TODO 
        //item['starRating'] = '&#x2605'.repeat(item.rating); if needed
      
        // Check if user is author if needed        
        //const isAuthor = req.user && req.user._id === movie.author.toString();
    
        // if(isAuthor) {
        //     movie.isAuthor = isAuthor;
        // }        

        res.locals.pageTitle = 'Details';        
        res.render('details', {stone, hasUser, isOwner, isLiked});
    }catch(err){
        res.locals.pageTitle = err.message;        
        res.render('404');
    }
});

catalogRouter.get('/search', async (req, res) => {     
    //TODO set guard if needed
    
    try{
        //TODO rename params, template and pageTitle 
        
        //TODO change like Exam 2 - do NOT overfetch
        let stones = await getAll();

        let search = null;
        
        if(req.query.search) {
            search = req.query.search.trim();           
            stones = stones.filter(stone => stone.name.toLowerCase().startsWith(search.toLowerCase()));
        }

        res.locals.pageTitle = 'Search';        
        res.render('search', {stones, search});
    }catch(err){
        res.locals.pageTitle = err.message;        
        res.render('404');
    }    
});

module.exports = { catalogRouter };