const db = require('./../models')
const express = require('express')

const router = express.Router()

router.get('/', async (req, res) => {
  res.render('./pages/auth/login', { title: 'Login', layout: 'layouts/auth' })
})

module.exports = router

