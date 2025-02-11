const { createCast } = require('../services/castService');

module.exports = {
    createGet: (req, res) => {
        res.render('cast-create', { pageTitle: 'Create Cast'});
    },

    createPost: async (req, res) => {
        const inputData = req.body;        

        //Set <errors> property as <true> if <inputData> is empty string (falsy value)
        const emptyFields = {
            name: !inputData.name,
            age: !inputData.age,
            born: !inputData.born,
            nameInMovie: !inputData.nameInMovie,
            imageURL: !inputData.imageURL                     
        };

        const invalidValues = {
            age: false,
            imageURL: false
        };

        const errorMessages = {
            hasMessage: false,
            emptyField: false,
            invalidAge: false,
            invalidImageURL: false         
        };

        //Check for empty fields
        if(Object.values(emptyFields).includes(true)) {
            errorMessages.emptyField = true;
            errorMessages.hasMessage = true;
        }

        //Check if age is between 0 and 200
        if(inputData.age !== '' && (Number(inputData.age) < 0 || Number(inputData.age) > 200)) {
            invalidValues.age = true;
            errorMessages.invalidAge = true;
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
            res.render('cast-create', { pageTitle: 'Create Cast', inputData, emptyFields, invalidValues, errorMessages});
            return;
        }

        //Add to database
        await createCast(inputData);
        res.redirect('/');          
    }
};

