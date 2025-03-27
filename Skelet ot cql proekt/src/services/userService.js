const { UserModel } = require('../models/User');
const bcrypt = require('bcrypt');

// TODO change credential names and imports depending on exam description

async function register(email, password) {
    const existing = await UserModel.findOne({email: email});

    if(existing) {
        throw new Error('Email is already taken');
    }

    if(!email || !password) {
        throw new Error('Email and password are required');
    }

    const user = new UserModel({
        email: email,
        password: await bcrypt.hash(password, 10)
    });

    await user.save();

    return user;
}

async function login(email, password) {
    const user = await UserModel.findOne({ email: email});

    if(!user) {
        throw new Error('Incorrect email or password');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if(!passwordMatch){
        throw new Error('Incorrect email or password');
    }

    return user;
}

module.exports = {
    register,
    login
};