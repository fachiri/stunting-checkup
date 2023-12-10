const express = require('express');
const auth = require('./../controllers/auth.controller');
const dashboard = require('./../controllers/dashboard.controller');
const master = require('./../controllers/master.controller');
const { isLoggedIn } = require('../middlewares/auth');

const router = express.Router();

router.get('/', (_, res) => res.redirect('/dasbor'))
router.get('/login', (_, res) => res.redirect('/auth/login'))
router.get('/dashboard', (_, res) => res.redirect('/dasbor'))

router.use('/auth', auth);
router.use(
  '/dasbor',
  isLoggedIn,
  dashboard
);
router.use(
  '/dasbor/master',
  isLoggedIn,
  master
);

module.exports = router;