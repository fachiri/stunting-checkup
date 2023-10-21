const db = require('../models')
const express = require('express')

const router = express.Router()

router.get('/balita', async (req, res) => {
  res.render('./pages/dashboard/master/balita', { title: 'Master Balita', layout: 'layouts/dashboard' })
})

router.get('/imunisasi', async (req, res) => {
  res.render('./pages/dashboard/master/imunisasi', { title: 'Master Imunisasi', layout: 'layouts/dashboard' })
})

module.exports = router

