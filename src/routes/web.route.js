const express = require('express');
const auth = require('./../controllers/auth.controller');
const dashboard = require('./../controllers/dashboard.controller');
const master = require('./../controllers/master.controller');

const router = express.Router();

router.get('/', (_, res) => res.redirect('/masuk'))
router.get('/login', (_, res) => res.redirect('/masuk'))
router.get('/dashboard', (_, res) => res.redirect('/dasbor'))

router.use('/masuk', auth);
router.use('/dasbor', dashboard);
router.use('/dasbor/master', master);

module.exports = router;