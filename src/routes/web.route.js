const express = require('express');
const auth = require('./../controllers/auth.controller');
const dashboard = require('./../controllers/dashboard.controller');

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/login');
});

router.use('/login', auth);
router.use('/dashboard', dashboard);

module.exports = router;