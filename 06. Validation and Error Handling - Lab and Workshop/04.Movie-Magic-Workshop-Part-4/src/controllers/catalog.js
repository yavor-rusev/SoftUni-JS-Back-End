const { Router } = require('express');

const { getAllMovies, getMovieById } = require('../services/movieService');

const catalogRouter = Router();

catalogRouter.get(
    '/',
    async (req, res) => {        
        try {
            const movies = await getAllMovies();
            
            //Search for 'home.hbs' template in 'views' directory, then:
            // - populate it with 'movieCart.hbs' partials from <partials> directory,
            // - insert it as <main> in 'main.hbs' layout template from <layouts> directory,
            // - and send last as body of <response>
            res.render('home', { pageTitle: 'Home', movies });
    
        } catch (err) {
            console.log('homeController() ->', err.message);
            res.render('404', { pageTitle: 'Error - ' + err.message });
        }
    }
);

catalogRouter.get(
    '/search',
    async (req, res) => {        
        const search = req.query;
        
        search.title = search.title?.trim();
        search.genre = search.genre?.trim();
        search.year = search.year?.trim();
        
        try{    
            let results = await getAllMovies();        
            
            //Filter movies by search inputs
            if(search.title) {
                results = results.filter(movie => movie.title.toLowerCase().includes(search.title.toLowerCase()));
            }
        
            if(search.genre) {
                results = results.filter(movie =>  movie.genre.toLowerCase() === search.genre.toLowerCase());
            }
        
            if(search.year) {
                results = results.filter(movie =>  movie.year === Number(search.year));
            }            
        
            res.render('search', { pageTitle: 'Search', search, results});

        }catch (err) {
            console.log('searchController() ->', err.message);
            res.render('404', { pageTitle: 'Error - ' + err.message });
        }
    }
);

catalogRouter.get(
    '/details/:id',
    async (req, res) => {
        try {
            const id = req.params.id;
            const movie = await getMovieById(id);
    
            if (!movie) {
                res.render('404', {pageTitle: 'Error'});
                return;
            }
    
            //Convert rating to stars
            movie['starRating'] = '&#x2605'.repeat(movie.rating);
    
            // Check if user is author           
            const isAuthor = req.user && req.user._id === movie.author.toString();
    
            if(isAuthor) {
                movie.isAuthor = isAuthor;
            }           
    
            res.render('details', { pageTitle: 'Details', movie });
    
        } catch (err) {
            console.log('detailsController() ->', err.message);
            res.render('404', { pageTitle: 'Error - ' + err.message });
        }
    }
);


module.exports = { catalogRouter };