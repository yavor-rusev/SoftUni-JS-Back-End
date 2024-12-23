const { createMovie } = require('../services/service');

module.exports = {
    createGet: (req, res) => {
        res.render('create', { tabTitle: 'Create' });
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
            rating: false
        };

        const errorMessages = {
            hasMessage: false,
            emptyField: false,
            invalidYear: false,
            invalidRating: false
        };

        //Check for empty fields
        if (Object.values(emptyFields).includes(true) ) {
            errorMessages.emptyField = true;
            errorMessages.hasMessage = true;        
        }

        //Check if years is more than 1899
        if (inputData.year !== '' && Number(inputData.year) < 1900) {            
            invalidValues.year = true;
            errorMessages.invalidYear = true;
            errorMessages.hasMessage = true;            
        }

        //Check if rating is between 1 and 10
        if (inputData.rating !== '' && Number(inputData.rating) > 10) {            
            invalidValues.rating = true;
            errorMessages.invalidRating = true;
            errorMessages.hasMessage = true;

        } else if (inputData.rating !== '' && Number(inputData.rating) < 1) {            
            invalidValues.rating = true;
            errorMessages.invalidRating = true;
            errorMessages.hasMessage = true;  
        }        

        //Check if there is any invalid value by checking if there is error message
        if(errorMessages.hasMessage) {
            res.render('create', { tabTitle: 'Create', inputData, emptyFields, invalidValues, errorMessages}); 
            return;
        }      

        //Add to database
        await createMovie(inputData);
        console.log('--> New movie is added:', inputData);  

        res.redirect('/');
    }
};