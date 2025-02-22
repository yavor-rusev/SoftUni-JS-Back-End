const handlebars = require('express-handlebars');

function configHandlebars(app) {    
    const hbsInstance = handlebars.create(
        //Set '.hbs' as an extension to handlebars templates (instead of default '.handlebars')
        {extname: '.hbs'}
    );

    //Add <handelbars.engine> as engine that handles '.hbs' files
    app.engine('.hbs', hbsInstance.engine);

    //Set that the engine which handles '.hbs' files (<handelbars.engine>) is of type 'view engine', which means that the '.hbs' files are templates
    app.set('view engine', '.hbs');
}

module.exports = {
    configHandlebars
};