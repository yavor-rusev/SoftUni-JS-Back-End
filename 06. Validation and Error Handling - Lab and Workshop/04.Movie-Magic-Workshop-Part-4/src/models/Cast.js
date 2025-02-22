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
        match: /^https?:\/\/.+/
    },
    movie: {
        type: Types.ObjectId,
        ref: 'Movie'
    }
});

const CastModel = model('Cast', castSchema);

module.exports = { CastModel };

