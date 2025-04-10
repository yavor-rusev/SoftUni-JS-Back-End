const { userRouter } = require('../controllers/user');
const { catalogRouter } = require('../controllers/catalog');
const { sneakerRouter } = require('../controllers/sneaker');
const { error404 } = require('../controllers/404');

function configRoutes(app) {
    app.use(userRouter);
    app.use(catalogRouter);
    app.use(sneakerRouter);
    app.all('*', error404);
}

module.exports = { configRoutes };