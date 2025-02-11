const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true 
    },
    genre: {
        type: String, 
        required: true 
    },
    director: {
        type: String, 
        required: true 
    },
    year: {
        type: Number, 
        required: true, 
        min: 1878,
        max: 2100
    },
    rating: {
        type: Number, 
        required: true, 
        min: 1,
        max: 5
    },
    description: {
        type: String, 
        required: true, 
        maxLength: 1000
    },
    imageURL: {
        type: String, 
        required: true, 
        regex: /^https?:\/\/.+/
    },
    cast: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Cast',
        default: []
    },
    author: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    isAuthor: {
        type: Boolean
    }
});

const MovieModel = mongoose.model('Movie', movieSchema);

module.exports = { MovieModel };


/*
  title – String, required 
  genre – String, required 
  director – String, required 
  year – Number, required, max and min value 
  rating – Number, required, max and min value 
  description – String, required, max length validation 
  imageURL – String, required, http/https validation 
  cast – a collection of ObjectIds, ref Cast Model 
*/




// class MovieModel {    
//     constructor() {         
//         this.id = null;
//         this.title = null;
//         this.genre = null;
//         this.director = null;
//         this.year = null;
//         this.imageURL = null;
//         this.rating = null;
//         this.description = null;  
//     }     
// };

// module.exports = {
//     MovieModel
// };