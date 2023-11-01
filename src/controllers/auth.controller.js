const db = require('./../models')
const express = require('express')
const bcrypt = require('bcryptjs');

const router = express.Router()

router.get('/login', async (req, res) => {
  res.render('./pages/auth/login', { 
    title: 'Login', 
    layout: 'layouts/auth',
    successMessages: req.flash('success'),
    errorMessages: req.flash('error')
  })
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.User.findOne({ username });

    if (!user) {
      throw new Error('Invalid username or password')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid username or password')
    }

    req.session.user = user;

    req.flash('success', `Selamat datang ${user.name}!`);
    return res.redirect(`/dasbor`)
  } catch (error) {
    console.error(error);
    req.flash('error', error.message);
    res.redirect(`/auth/login`)
  }
})

module.exports = router

