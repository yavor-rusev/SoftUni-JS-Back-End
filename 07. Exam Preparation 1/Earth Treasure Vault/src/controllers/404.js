function error404(req, res) {
    res.locals.pageTitle = 'Error 404';
    res.render('404');
}

module.exports = { error404 };