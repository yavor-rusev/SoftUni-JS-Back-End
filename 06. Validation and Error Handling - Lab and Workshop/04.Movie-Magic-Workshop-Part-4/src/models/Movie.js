const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    // Title must be at least 5 characters long, which could be English letters, digits, "-", "," and whitespaces
    title: {
        type: String,      
        required: [true, 'Title is required'],
        trim: true,
        minlength: [5, 'Title must be at least 5 characters long'],
        match:[/^[a-zA-Z0-9,\- ]+$/, 'Title must contain only English letters, digits, "-", "," and whitespaces']
    },
    // Genre must be at least 5 characters long, which could be English letters, digits, "-" and whitespaces
    genre: {
        type: String,
        trim: true, 
        required: [true, 'Genre is required'],
        minlength: [5, 'Genre must be at least 5 characters long'],
        match: [/^[a-zA-Z0-9\- ]+$/, 'Genre must contain only English letters, digits, "-" and whitespaces']
    },
    // Director must be at least 5 characters long, which could be English letters, digits, "-" and whitespaces
    director: {
        type: String,
        trim: true,  
        required: [true, 'Director is required'],
        minlength: [5, 'Director must be at least 5 characters long'],
        match: [/^[a-zA-Z0-9\- ]+$/, 'Director must contain only English letters, digits, "-" and whitespaces']
    },
    // Year must be between 1878 and 2100
    year: {
        type: Number,        
        required: [true, 'Year is required'],
        min: [1878,'Year must be between 1878 and 2100'], 
        max: [2100,'Year must be between 1878 and 2100']
    },
    // Movie Poster URL should start with http://... or https://...
    imageURL: {
        type: String,
        trim: true,
        required: [true, 'Movie Poster URL is required'], 
        match: [/^https?:\/\/.+/, 'Movie Poster URL should start with http://... or https://...'],
    },
    // Rating must be between 1 and 5
    rating: {
        type: Number,        
        required: [true, 'Rating is required'], 
        min: [1,'Rating must be between 1 and 5'],
        max: [5,'Rating must be between 1 and 5']        
    },
    // Description must be at least 20 characters, which could be English letters, digits, "-", ".", "," and whitespaces
    description: {
        type: String,
        trim: true,
        required: [true, 'Description is required'],
        minlength: [20, 'Description must be at least 20 characters long'],
        match: [/^[a-zA-Z0-9\-., ]+$/, 'Description must contain only English letters, digits, "-", ".", "," and whitespaces']       
    },
    // Cast must be an array of ObjectId's
    cast: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Cast',
        default: []
    },
    // Author must be of type "ObjectId"
    author: {
        type: mongoose.SchemaTypes.ObjectId,
        required: [true, 'Author is required']
    },
    // isAuthor must be of type "Boolean"
    isAuthor: {
        type: Boolean
    }
});

const MovieModel = mongoose.model('Movie', movieSchema);

module.exports = { MovieModel };
