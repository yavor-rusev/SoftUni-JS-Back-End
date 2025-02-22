const { movieRouter } = require('../controllers/movie');
const { userRouter } = require('../controllers/user');
const { catalogRouter } = require('../controllers/catalog');
const { castRouter } = require('../controllers/cast');
const { attachRouter } = require('../controllers/attach');

const { aboutController } = require('../controllers/about');
const { errorController } = require('../controllers/404');

function configRoutes(app) {
    app.use(userRouter);
    app.use(catalogRouter);
    app.use(movieRouter);
    app.use(castRouter);
    app.use(attachRouter);
    
    app.use('/about', aboutController);
    app.all('*', errorController);
}

module.exports = {
    configRoutes
};
