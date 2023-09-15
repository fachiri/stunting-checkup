const db = require('./../models')
const express = require('express')

const router = express.Router()

router.get('/', async (req, res) => {
  res.render('./pages/dashboard', { title: 'Dashboard', layout: 'layouts/dashboard' })
})

router.get('/checkup', async (req, res) => {
  res.render('./pages/dashboard/checkup', { title: 'Pemeriksaan', layout: 'layouts/dashboard' })
})

router.get('/report', async (req, res) => {
  res.render('./pages/dashboard/report', { title: 'Laporan', layout: 'layouts/dashboard' })
})

module.exports = router

