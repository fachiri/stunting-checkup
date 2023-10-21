const db = require('./../models')
const express = require('express')

const router = express.Router()

router.get('/', async (req, res) => {
  res.render('./pages/dashboard', { title: 'Dasbor', layout: 'layouts/dashboard' })
})

router.get('/pengaturan', async (req, res) => {
  res.render('./pages/dashboard/pengaturan', { title: 'Pengaturan', layout: 'layouts/dashboard' })
})

module.exports = router

