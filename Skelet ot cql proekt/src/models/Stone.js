const { Schema, model, Types} = require('mongoose');

//TODO change schema and model, and adapt/remove validation depending on exam description

const stoneSchema = new Schema(
    {
        name: {
            type: String,      
            required: [true, 'Title is required'],
            trim: true,
            minlength: [2, 'Title must be at least 2 characters long'],
            match:[/^[a-zA-Z0-9,\- ]+$/, 'Title must contain only English letters, digits, "-", "," and whitespaces']
        },
        category: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: true
        },
        image: {
            type: String,
            trim: true,
            required: [true, 'Movie Poster URL is required'], 
            match: [/^https?:\/\/.+/, 'Movie Poster URL should start with http://... or https://...'],
        },
        location: {
            type: String,
            required: true
        },
        formula: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        // year: {
        //     type: Number,        
        //     required: [true, 'Year is required'],
        //     min: [1878,'Year must be between 1878 and 2100'], 
        //     max: [2100,'Year must be between 1878 and 2100']
        // },
        likedList: {
            type: [Types.ObjectId],
            ref: 'User',
            default: []
        },
        owner: {
            type: Types.ObjectId,
            ref: 'User'
        }
    }
);

const StoneModel = model('Stone', stoneSchema);

module.exports = { StoneModel };
