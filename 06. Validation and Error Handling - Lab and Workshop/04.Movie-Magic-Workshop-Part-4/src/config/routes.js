const express = require('express');

const { movieRouter } = require('../controllers/movie');
const { userRouter } = require('../controllers/user');
const { catalogRouter } = require('../controllers/catalog');
const { castRouter } = require('../controllers/cast');
const { attachRouter } = require('../controllers/attach');

const { aboutController } = require('../controllers/about');
const { errorController } = require('../controllers/404');


const router = express.Router();

router.use(userRouter);
router.use(catalogRouter);
router.use(movieRouter);
router.use(castRouter);
router.use(attachRouter);

router.use('/about', aboutController);
router.all('*', errorController);

module.exports = {
    router
};
