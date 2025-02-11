const { getAllCast, attachMovieToCast } = require('../services/castService');
const { attachCastToMovie, removeCastFromMovie, getMovieById } = require('../services/movieService');

module.exports = {
    attachGet: async (req, res) => {
        const movieId = req.params.id;
        const movie = await getMovieById(movieId);

        if (!movie) {
            res.render('404', { pageTitle: 'Error' });
            return;
        }

        let allCast = await getAllCast();

        //Filter only cast that are not already attached to a movie
        allCast = allCast.filter(castProxy => !!castProxy.movie === false);

        /*
        //Filter only cast that are not already attached to THAT movie
        const movieCastAsArrayOfStrings = movie.cast.map(cast => cast._id = cast._id.toString());
        allCast = allCast.filter(castProxy => !movieCastAsArrayOfStrings.includes(castProxy._id.toString()));
        */

        res.render('cast-attach', { pageTitle: 'Attach Cast', movie, allCast });
    },

    attachPost: async (req, res) => {
        const movieId = req.params.id;
        const castId = req.body.cast;

        if (!movieId || !castId) {
            console.error(`Missing ${movieId} or ${castId}`);

            res.status(400).end();
            return;
        }

        let emptyCast = false;

        if (castId === 'none') {
            emptyCast = true;

            const movie = await getMovieById(movieId);

            if (!movie) {
                res.render('404', { pageTitle: 'Error' });
                return;
            }

            let allCast = await getAllCast();

            //Filter only cast that are not already attached to a movie
            allCast = allCast.filter(castProxy => !!castProxy.movie === false);

            /*
            //Filter only cast that are not already attached to THAT movie
            const movieCastAsArrayOfStrings = movie.cast.map(cast => cast._id = cast._id.toString());
            allCast = allCast.filter(castProxy => !movieCastAsArrayOfStrings.includes(castProxy._id.toString()));
            */

            res.render('cast-attach', { pageTitle: 'Attach Cast', movie, allCast, emptyCast });
            return;
        }

        try {            
            await attachCastToMovie(movieId, castId);         

        } catch (err) {
            console.error(`Failed to add cast to movie --> ${err}`);            

            res.status(400).end();
            return;
        }


        try {
            await attachMovieToCast(castId, movieId);

        } catch (err) {
            console.error(`Failed to add movie to cast --> ${err}`);

            //Delete cast that is already added to <cast> array of the movie
            await removeCastFromMovie(movieId, castId);
            console.log('Removed the cast:', castId, 'that was already added to <cast> array of the movie', movieId);                        

            res.status(400).end();
            return;
        }

        res.redirect('/details/' + movieId);
    }
};