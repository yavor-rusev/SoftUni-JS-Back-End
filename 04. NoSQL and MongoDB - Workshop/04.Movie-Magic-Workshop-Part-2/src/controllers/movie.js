const { createMovie } = require('../services/movieService');

module.exports = {
    createGet: (req, res) => {
        res.render('movie-create', { pageTitle: 'Create Movie' });
    },

    createPost: async (req, res) => {
        const inputData = req.body;        

        //Set <errors> property as <true> if <inputData> is empty string (falsy value)
        const emptyFields = {
            title: !inputData.title,
            genre: !inputData.genre,
            director: !inputData.director,
            year: !inputData.year,
            imageURL: !inputData.imageURL,
            rating: !inputData.rating,
            description: !inputData.description           
        };

        const invalidValues = {
            year: false,
            rating: false,
            description: false,
            imageURL: false
        };

        const errorMessages = {
            hasMessage: false,
            emptyField: false,
            invalidYear: false,
            invalidRating: false,
            invalidDescription: false,
            invalidImageURL: false
        };

        //Check for empty fields
        if (Object.values(emptyFields).includes(true) ) {
            errorMessages.emptyField = true;
            errorMessages.hasMessage = true;        
        }

        //Check if years is more than 1877
        if (inputData.year !== '' && Number(inputData.year) < 1878) {            
            invalidValues.year = true;
            errorMessages.invalidYear = true;
            errorMessages.hasMessage = true;            
        }

        //Check if rating is between 1 and 5
        if (inputData.rating !== '' && (Number(inputData.rating) < 1 || Number(inputData.rating) > 5)) {            
            invalidValues.rating = true;
            errorMessages.invalidRating = true;
            errorMessages.hasMessage = true;

        } 
        
        //Check if description is up to 1000 characters
        if (inputData.description.length > 1000) {
            invalidValues.description = true;
            errorMessages.invalidDescription = true;
            errorMessages.hasMessage = true;
        }

        //Check if imageURL starts with http
        if (inputData.imageURL !== '' && !inputData.imageURL.startsWith('http')) {
            invalidValues.imageURL = true;
            errorMessages.invalidImageURL = true;
            errorMessages.hasMessage = true;
        }

        //Check if there is any invalid value by checking if there is error message
        if(errorMessages.hasMessage) {
            res.render('movie-create', { pageTitle: 'Create Movie', inputData, emptyFields, invalidValues, errorMessages}); 
            return;
        }      

        //Add to database
        await createMovie(inputData);
        res.redirect('/');
    }
};