const jwt = require('jsonwebtoken');

const secret = 'jwt super s3cret';

// TODO change credential names depending on exam description

function createToken(userData){
    const payload = {
        email: userData.email,
        _id: userData._id
    };

    const token = jwt.sign(payload, secret,{
        expiresIn: '1d'
    });

    return token;
}

function verifyToken(token) {
    const userData = jwt.verify(token, secret);
    return userData;
}

module.exports = {
    createToken,
    verifyToken
};