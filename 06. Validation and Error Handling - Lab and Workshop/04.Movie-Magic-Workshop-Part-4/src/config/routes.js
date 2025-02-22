const express = require('express');
const { isGuest, isUser } = require('../middlewares/guards');
const { homeController, searchController, detailsController } = require('../controllers/catalog');
const { aboutController } = require('../controllers/about');
const { registerGet, registerPost, loginGet, loginPost, logout } = require('../controllers/user');
const { createGet: createMovieGet, createPost: createMoviePost, editGet, editPost, deleteGet, deletePost } = require('../controllers/movie');
const { createGet: createCastGet, createPost: createCastPost } = require('../controllers/cast');
const { attachGet, attachPost } = require('../controllers/attach');
const { errorController } = require('../controllers/404');


const router = express.Router();

router.get('/', homeController);
router.get('/about', aboutController);
router.get('/search', searchController);
router.get('/details/:id', detailsController);

router.get('/register', isGuest(), registerGet);
router.post('/register', isGuest(), registerPost);
router.get('/login', isGuest(), loginGet);
router.post('/login', isGuest(), loginPost);
router.get('/logout', isUser(), logout);

router.get('/create/movie', isUser(), createMovieGet);
router.post('/create/movie', isUser(), createMoviePost);
router.get('/edit/movie/:id', isUser(), editGet);
router.post('/edit/movie/:id', isUser(), editPost);
router.get('/delete/movie/:id', isUser(), deleteGet);
router.post('/delete/movie/:id', isUser(), deletePost);

router.get('/create/cast', isUser(), createCastGet);
router.post('/create/cast', isUser(), createCastPost);
router.get('/attach/cast/:id', isUser(), attachGet);
router.post('/attach/cast/:id', isUser(), attachPost);

router.all('*', errorController);

module.exports = {
    router
};
