const { Schema, SchemaTypes: Types, model } = require('mongoose');

const castSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
        min: 0,
        max: 200
    },
    born: {
        type: String,
        required: true
    },
    nameInMovie: {
        type: String,
        required: true
    },
    imageURL: {       
        type: String,
        required: true,
        regex: /^https?:\/\/.+/
    },
    movie: {
        type: Types.ObjectId,
        ref: 'Movie'
    }
});

const CastModel = model('Cast', castSchema);

module.exports = { CastModel };


/*
•	name – String, required 
•	age – Number, required, max and min value 
•	born – String, required 
•	name in movie – String, required 
•	cast image – String, required, http/https validation 
•	movie – ObjectId, ref Movie Model 
*/
//TODO