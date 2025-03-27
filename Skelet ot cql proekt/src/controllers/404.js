//TODO change logic depending on exam description

function error404(req, res) {
    res.locals.pageTitle = 'Error 404';
    res.render('404');

    // or res.render('404', { pageTitle: 'Error' }); depending on pattern of controllers
}

module.exports = { error404 };