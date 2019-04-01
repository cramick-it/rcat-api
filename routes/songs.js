const router = require('express').Router();
const boom = require('boom');
const { isAuthenticated } = require('../middlewares/auth-middleware');
const songsController = require('../controllers/song-controller');

router.use(isAuthenticated);

router.get('/', async (req, res, next) => {
    try {
        const songs = await songsController.listAllSongs(req, res);
        res.send(songs);
    } catch (err) {
        throw boom.boomify(err);
    }
});

router.post('/', async (req, res, next) => {
    const data = await songsController.storeSong(req, res);
    res.send(data);
});

module.exports = router;
