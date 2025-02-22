const {Schema, model} = require('mongoose');

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
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