module.exports = {
    aboutController: (req, res) => {
        res.render('about', { pageTitle: 'About' });
    }
};