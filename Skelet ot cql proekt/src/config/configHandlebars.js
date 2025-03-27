const handlebars = require('express-handlebars');

//TODO change layout template

function configHandlebars(app) {
    const hbs = handlebars.create({
        extname: 'hbs'
    });

    app.engine('hbs', hbs.engine);
    app.set('view engine', 'hbs');
}

module.exports = { configHandlebars };