const express = require('express');

function configExpress(app) {
    //Add Express middleware for parsing of url-encoded request's body and populate it in <request.body>
    app.use(express.urlencoded({extended: true}));

    //Add Express middleware for reading and sending static files
    app.use('/static', express.static('static'));
}

module.exports = {
    configExpress
};