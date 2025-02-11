const express = require('express');
const { isGuest, isUser } = require('../middlewares/guards');
const { homeController, searchController, detailsController } = require('../controllers/catalog');
const { aboutController } = require('../controllers/about');
const { createGet: createMovieGet, createPost: createMoviePost } = require('../controllers/movie');
const { createGet: createCastGet, createPost: createCastPost } = require('../controllers/cast');
const { attachGet, attachPost } = require('../controllers/attach');
const { errorController } = require('../controllers/404');
const { registerGet, registerPost, loginGet, loginPost, logout } = require('../controllers/user');


const router = express.Router();

router.get('/', homeController);
router.get('/about', aboutController);
router.get('/search', searchController);
router.get('/details/:id', detailsController);

router.get('/register', isGuest(), registerGet);
router.post('/register', isGuest(), registerPost);
router.get('/login', isGuest(), loginGet);
router.post('/login', isGuest(), loginPost);

router.get('/create/movie', isUser(), createMovieGet);
router.post('/create/movie', isUser(), createMoviePost);
router.get('/create/cast', isUser(), createCastGet);
router.post('/create/cast', isUser(), createCastPost);
router.get('/attach/cast/:id', isUser(), attachGet);
router.post('/attach/cast/:id', isUser(), attachPost);
router.get('/logout', isUser(), logout);

router.all('*', errorController);

module.exports = {
    router
};
