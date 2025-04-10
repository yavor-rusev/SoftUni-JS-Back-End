const { Schema, model, Types} = require('mongoose');


const sneakerSchema = new Schema(
    {
        brand: {
            type: String,      
            required: true            
        },
        model: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        condition: {
            type: String,
            required: true
        },
        year: {
            type: Number,
            required: true
        },
        size: {
            type: Number,
            required: true
        },      
        image: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },        
        preferredList : {
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

const SneakerModel = model('Sneaker', sneakerSchema);

module.exports = { SneakerModel };
