module.exports = {
    errorController: (req, res) =>{
        res.render('404', { pageTitle: 'Error' });
    }
};