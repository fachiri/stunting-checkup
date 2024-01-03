const express = require('express');
const informasi = require('./../controllers/api/informasi.controller')
const checkup = require('./../controllers/api/checkup.controller');
const statistics = require('./../controllers/api/statistics.controller');
const search = require('./../controllers/api/search.controller');

const router = express.Router();

router.use('/checkup', checkup);
router.use('/statistics', statistics);
router.use('/informasi', informasi);
router.use('/search', search);

module.exports = router;