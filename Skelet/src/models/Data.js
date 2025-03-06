const { Schema, model, Types} = require('mongoose');

//TODO change schema and model depending on exam description

const dataSchema = new Schema(
    {
        propName1: {
            type: String,
            required: true
        },
        propName2: {
            type: Number,
            required: true
        },
        author: {
            type: Types.ObjectId,
            ref: 'User'
        },
        likes: {
            type: [Types.ObjectId],
            ref: 'User',
            default: []
        }
    }
);

const DataModel = model('Data', dataSchema);

module.exports = { DataModel };
