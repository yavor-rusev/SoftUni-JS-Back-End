const bcrypt = require('bcrypt');
const { UserModel } = require('../models/User');


async function register(email, password) {
    const userExist = await UserModel.findOne({email});
    
    // check if user with this email already exists -> throw error if true
    if(userExist) {
        throw new Error('Email is already used');
    }

    /* If there is no express validation and password is hashed before passed to Mongoose

    //Password should be at least 6 characters long
    if(password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
    }
    
    // Password should consist only of English letters and digits 
    if(!(/^[a-zA-Z0-9]+$/.test(password))) {
        throw new Error('Password must contain only English letters and digits');
    }
    */

    // create database record proxy with hashed password
    const user = new UserModel({
        email,        
        password: await bcrypt.hash(password, 10)    
    }); 

    // save record proxy in database
    await user.save();

    // return saved record
    return user;    
}

async function login(email, password) {
    const user = await UserModel.findOne({email});
    
    // check if user with this email exists -> throw error if false
    if(!user) {        
        throw new Error('Incorrect email or password!');
    }

    
    /* If there is no express validation and password is hashed before passed to Mongoose

    //Password should be at least 6 characters long
    if(password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
    }
    
    // Password should consist only of English letters and digits 
    if(!(/^[a-zA-Z0-9]+$/.test(password))) {
        throw new Error('Password must contain only English letters and digits');
    }
    */    

    // compare hashed passwords - throw error if false
    const passwordsMatch = await bcrypt.compare(password, user.password);

    if(!passwordsMatch) {        
        throw new Error('Incorrect email or password!');    
    }

    // return matched user    
    return user;    
}

module.exports = {
    register,
    login
};