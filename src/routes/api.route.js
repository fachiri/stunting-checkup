const express = require('express');
const checkup = require('./../controllers/api/checkup.controller');
const statistics = require('./../controllers/api/statistics.controller');

const router = express.Router();

router.use('/checkup', checkup);
router.use('/statistics', statistics);

module.exports = router;