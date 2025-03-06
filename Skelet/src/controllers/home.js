const { Router } = require('express');
const { isGuest } = require('../middlewares/guards');
// const { createToken } = require('../services/jwtService');
// const { login } = require('../services/userService');

const homeRouter = Router();

//TODO add/change actions depending on exam description
//TODO add guards if needed
//TODO add express validation if needed

homeRouter.get('/', isGuest(), async (req, res) => {
    // const result = await login('asd@asd.asd', '123456');
    // console.log(result);

    // const token = createToken(result);
    // console.log(token);

    // res.cookie('token', token);
    
    res.render('home');
});

module.exports = { homeRouter};