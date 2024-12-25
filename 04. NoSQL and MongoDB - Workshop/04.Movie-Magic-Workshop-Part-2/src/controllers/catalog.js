const { getAllMovies, getMovieById } = require('../services/movieService');

module.exports = {
    homeController: async (req, res) => {
        try {
            const movies = await getAllMovies();
            
            //Search for 'home.hbs' template in 'views' directory, then:
            // - populate it with 'movieCart.hbs' partials from <partials> directory,
            // - insert it as <main> in 'main.hbs' layout template from <layouts> directory,
            // - and send last as body of <response>
            res.render('home', { pageTitle: 'Home', movies });

        } catch (err) {
            console.log(err);
            res.redirect('404');
        }
    },

    searchController: async (req, res) => {
        const search = req.query;
        
        search.title = search.title?.trim();
        search.genre = search.genre?.trim();
        search.year = search.year?.trim();       

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
    },

    detailsController: async (req, res) => {
        try {
            const id = req.params.id;
            const movie = await getMovieById(id);

            if (!movie) {
                res.render('404', {pageTitle: 'Error'});
                return;
            }

            //Convert rating to stars
            movie['starRating'] = '&#x2605'.repeat(movie.rating);

            res.render('details', { pageTitle: 'Details', movie });

        } catch (err) {
            console.log(err);
            res.redirect('404');
        }
    }
};