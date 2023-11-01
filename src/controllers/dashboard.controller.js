const db = require('./../models')
const express = require('express')

const router = express.Router()

router.get('/', async (req, res) => {
  let data = {}
  
  data.user = req.session.user

  res.render('./pages/dashboard', { 
    title: 'Dasbor', 
    layout: 'layouts/dashboard',
    data,
    successMessages: req.flash('success'),
    errorMessages: req.flash('error'),
  })
})

router.get('/pengaturan', async (req, res) => {
  res.render('./pages/dashboard/pengaturan', { 
    title: 'Pengaturan', 
    layout: 'layouts/dashboard',
    successMessages: req.flash('success'),
    errorMessages: req.flash('error')
  })
})

module.exports = router

