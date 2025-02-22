const bcrypt = require('bcrypt');
const { UserModel } = require('../models/User');


async function register(email, password) {
    const userExist = await UserModel.findOne({email});
    
    // check if user with this email already exists -> throw error if true
    if(userExist) {
        throw new Error('Email is already used');
    }

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