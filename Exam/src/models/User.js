const { Schema, model} = require('mongoose');

const userSchema = new Schema(
    {
        name: {
            type: String,            
            required: true,           
            minlength: [2, 'Name should be between 2 and 20 characters long'],
            maxlength: [20, 'Name should be between 2 and 20 characters long']
        },
        email: {
            type: String,            
            required: true,
            unique: true,
            minlength: [10, 'Email should be at least 10 characters long']         
        },
        password: {
            type: String,
            required: true,            
            minlength: [4, 'Password should be at least 4 characters long']            
        }
    },
    {
        collation: {
            locale: 'en',
            strength: 2
        }
    }
);

const UserModel = model('User', userSchema);

module.exports = { UserModel };