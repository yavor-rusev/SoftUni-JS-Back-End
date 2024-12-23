const express = require('express');
const { homeController, searchController, detailsController } = require('../controllers/catalog');
const { aboutController } = require('../controllers/about');
const { createGet, createPost } = require('../controllers/movie');
const { errorController } = require('../controllers/404');


const router = express.Router();

router.get('/', homeController);
router.get('/about', aboutController);
router.get('/details/:id', detailsController);
router.get('/search', searchController);
router.get('/create', createGet);
router.post('/create', createPost);

router.all('*', errorController);

module.exports = {
    router
};
