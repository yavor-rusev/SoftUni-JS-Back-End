const { Schema, SchemaTypes: Types, model } = require('mongoose');

const castSchema = new Schema (
    {
        // Name must be at least 5 characters long, which could be English letters, digits, "-" and whitespaces
        name: {
            type: String,
            trim: true,
            required: [true, 'Name is required'],
            minlength: [5, 'Name must be at least 5 characters long'],
            match: [/^[a-zA-Z0-9\- ]+$/, 'Name must contain only English letters, digits, "-" and whitespaces']
        },
        // Age must be between 1 and 120
        age: {
            type: Number,
            required: [true, 'Age is required'],
            min: [1, 'Age must be between 1 and 120'],
            max: [120, 'Age must be between 1 and 120'],
        },
        // Born must be at least 10 characters, which could be English letters, digits, "-", "," and whitespaces
        born: {
            type: String,
            trim: true,
            required: [true, 'Born is required'],
            minlength: [10, 'Born must be at least 10 characters long'],
            match: [/^[a-zA-Z0-9\-, ]+$/, 'Born must contain only English letters, digits, "-", "," and whitespaces']
        },
        // Name-in-movie must be at least 5 characters long, which could be English letters, digits, "-" and whitespaces
        nameInMovie: {
            type: String,
            trim: true,
            required: [true, 'Name-in-Movie is required'],
            minlength: [5, 'Name-in-Movie must be at least 5 characters long'],
            match: [/^[a-zA-Z0-9\- ]+$/, 'Name-in-Movie must contain only English letters, digits, "-" and whitespaces']
        },
        // Cast image URL should start with http://... or https://...
        imageURL: {       
            type: String,
            trim: true,
            required: [true, 'Cast image URL is required'],
            match: [/^https?:\/\/.+/, 'Cast image URL should start with http://... or https://...']
        },
        // Movie must be of type "ObjectId"
        movie: {
            type: Types.ObjectId,
            ref: 'Movie'
        }
    },
    {
        // Increment <_v> on every update
        optimisticConcurrency: true
    }
);

const CastModel = model('Cast', castSchema);

module.exports = { CastModel };

