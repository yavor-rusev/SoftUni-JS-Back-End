const { UserModel } = require('../models/User');
const bcrypt = require('bcrypt');


async function register(name, email, password) {
    const existing = await UserModel.findOne({email});

    if(existing) {
        throw new Error('Email is already taken');
    }

    if(!name || !email || !password) {
        throw new Error('All fields are required');
    }

    const user = new UserModel({
        name: name,
        email: email,
        password: await bcrypt.hash(password, 10)
    });

    await user.save();

    return user;
}

async function login(email, password) {
    const user = await UserModel.findOne({email});

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