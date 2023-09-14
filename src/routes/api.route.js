const express = require('express');
const checkup = require('./../controllers/api/checkup.controller');

const router = express.Router();

router.use('/checkup', checkup);

module.exports = router;