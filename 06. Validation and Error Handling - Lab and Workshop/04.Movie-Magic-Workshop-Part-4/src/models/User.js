const {Schema, model} = require('mongoose');

const userSchema = new Schema(
    {
        //Email should end in @x.x, where x is one or more English letters, digits and ".", and should be at least 10 characters long        
        email: {
            type: String,
            trim: true,
            required: [true,'Email is required'], 
            match: [/^[a-zA-Z0-9]+@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/, 'Invalid email format'],
            minlength: [10, 'Email must be at least 10 characters long'],
            lowercase: true,
            unique: true
        },        
        
        password: {
            type: String,
            required: [ true,'Password is required']
            
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

module.exports = {UserModel};