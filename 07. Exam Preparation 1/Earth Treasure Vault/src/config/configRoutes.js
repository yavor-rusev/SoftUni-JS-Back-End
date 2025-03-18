const { userRouter } = require('../controllers/user');
const { catalogRouter } = require('../controllers/catalog');
const { stoneRouter } = require('../controllers/stone');
const { error404 } = require('../controllers/404');

function configRoutes(app) {
    app.use(userRouter);
    app.use(catalogRouter);
    app.use(stoneRouter);
    app.use('*', error404);   
}

module.exports = { configRoutes };