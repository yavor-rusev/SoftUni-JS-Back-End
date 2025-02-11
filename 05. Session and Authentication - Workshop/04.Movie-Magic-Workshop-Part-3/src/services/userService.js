const bcrypt = require('bcrypt');
const { UserModel } = require('../models/User');

// mahni logogvete!!!!

async function register(email, password) {
    // check if user exist -> throw error if true
    const userExist = await UserModel.findOne({email});

    if(userExist) {
        throw new Error('Email is already used');
    }

    // create database record with hashed password
    const user = new UserModel({
        email,        
        password: await bcrypt.hash(password, 10)    
    });    

    await user.save();

    // return saved record
    return user;    
}

async function login(email, password) {

    console.log('Credentials for login ->', email, password);

    // check if user exist -> throw error if false
    const user = await UserModel.findOne({email});
    
    if(!user) {
        console.log('logging user does not exist ->', user);
        throw new Error('Incorrect email or password!');
    }

    // compare hashed passwords - throw error if false
    const passwordsMatch = await bcrypt.compare(password, user.password);

    if(!passwordsMatch) {
        console.log('Incorrect login password');
        throw new Error('Incorrect email or password!');    
    }

    // return mached user    
    return user;    
}

module.exports = {
    register,
    login
};