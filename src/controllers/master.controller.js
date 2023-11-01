const { validateStoreBalita, validateUpdateBalita } = require('../middlewares/validation');
const db = require('../models')
const express = require('express')

const router = express.Router()

router.get('/balita', async (req, res) => {
  const dataBalita = await db.Balita.findAll();

  const data = {
    balita: dataBalita
  }

  res.render('./pages/dashboard/master/balita', {
    title: 'Master Balita',
    layout: 'layouts/dashboard',
    successMessages: req.flash('success'),
    errorMessages: req.flash('error'),
    oldData: req.flash('form'),
    data
  })
})

router.get('/balita/:uuid', async (req, res) => {
  const dataBalita = await db.Balita.findOne({
    where: {
      uuid: req.params.uuid
    }
  });

  const data = {
    balita: dataBalita
  }

  res.render('./pages/dashboard/master/balita-detail', {
    title: 'Detail Balita',
    layout: 'layouts/dashboard',
    successMessages: req.flash('success'),
    errorMessages: req.flash('error'),
    oldData: req.flash('form'),
    data
  })
})

router.post('/balita', validateStoreBalita, async (req, res) => {
  try {
    const data = await db.Balita.create(req.body)

    req.flash('success', 'Data balita berhasil disimpan.');
    res.redirect(`/dasbor/master/balita/${data.uuid}`)
  } catch (error) {
    req.flash('error', error.message);
    res.redirect(`/dasbor/master/balita`)
  }
})

router.post('/balita/:uuid/update', validateUpdateBalita, async (req, res) => {
  try {
    const data = await db.Balita.findOne({
      where: {
        uuid: req.params.uuid
      }
    });

    if (!data) {
      throw new Error('Data tidak ditemukan')
    }

    data.update(req.body)

    req.flash('success', 'Data balita berhasil diedit.');
    res.redirect(`/dasbor/master/balita/${data.uuid}`)
  } catch (error) {
    console.log(error)
    req.flash('error', error.message);
    res.redirect(`/dasbor/master/balita`)
  }
})

router.get('/balita/:uuid/delete', async (req, res) => {
  try {
    const data = await db.Balita.findOne({
      where: {
        uuid: req.params.uuid
      }
    });

    if (!data) {
      throw new Error('Data tidak ditemukan')
    }

    data.destroy()

    req.flash('success', 'Data balita berhasil dihapus.');
    res.redirect(`/dasbor/master/balita`)
  } catch (error) {
    console.log(error)
    req.flash('error', error.message);
    res.redirect(`/dasbor/master/balita`)
  }
})

router.get('/imunisasi', async (req, res) => {
  res.render('./pages/dashboard/master/imunisasi', { title: 'Master Imunisasi', layout: 'layouts/dashboard' })
})

module.exports = router

