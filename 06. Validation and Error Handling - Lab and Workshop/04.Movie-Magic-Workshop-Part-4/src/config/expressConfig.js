const express = require('express');
const cookieParser = require('cookie-parser');
const { session } = require('../middlewares/session');

const secret = 'secret of cookie-parsing';

function configExpress(app) {
    //Add <cookie-parser> third-party middleware for sending cookie headers through <response.cookie()> and parsing <request.cookie> strings
    app.use(cookieParser(secret));

    // Add <session> local middleware for attaching <user> (session) property to <request>
    app.use(session());

    //Add Express <urlencoded> middleware for parsing of url-encoded request's body and populate it in <request.body>
    app.use(express.urlencoded({extended: true}));

    //Add Express <static> middleware for reading and sending static files through stream
    app.use('/static', express.static('static'));
}

module.exports = { configExpress };