const { validateStoreBalita, validateUpdateBalita } = require('../middlewares/validation');
const { UUIDV4 } = require('sequelize')
const db = require('../models')
const express = require('express')
const { v4: uuidv4 } = require('uuid')
const session = require('express')

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
  const data = db.Checkup.findAll()
  res.render('./pages/dashboard/master/balita', { title: 'Master Balita', layout: 'layouts/dashboard' })
})

router.get('/imunisasi', async (req, res) => {
  const data = await db.Informasi.findAll();

  res.render('./pages/dashboard/master/imunisasi', {
    title: 'Master Imunisasi',
    layout: 'layouts/dashboard',
    informasi: data,
    successMessages: req.flash('success'),
    errorMessages: req.flash('error'),
  })
})

router.get('/imunisasi/:id', async (req, res) => {
  const data = await db.Informasi.findAll({ where: { uuid: req.params.id } });
  res.render('./pages/dashboard/master/editInformasi', {
    title: 'Master Informasi Imunisasi',
    layout: 'layouts/dashboard',
    data: data,
    successMessages: req.flash('success'),
    errorMessages: req.flash('error'),
  })
})

router.post('/imunisasi/hapus/:id', async (req, res) => {
  try {
    await db.Informasi.destroy({ where: { uuid: req.params.id } });

    req.flash('success', 'Data berhasil dihapus.');
    res.redirect(`/dasbor/master/imunisasi`)
  } catch (error) {
    req.flash('error', error.message);
    res.redirect(`/dasbor/master/imunisasi`)
  }
})

router.post('/imunisasi/edit/:id', async (req, res) => {
  try {
    await db.Informasi.update(req.body, { where: { id: req.params.id } });

    req.flash('success', 'Data berhasil diedit.');
    res.redirect(`/dasbor/master/imunisasi`)
  } catch (error) {
    req.flash('error', error.message);
    res.redirect(`/dasbor/master/imunisasi`)
  }
})

router.post('/imunisasi', async (req, res) => {
  const { lokasi, acara, status, nama_acara, tanggal, waktu_mulai, waktu_berakhir, deskripsi } = req.body
  try {
    const sendData = {
      uuid: uuidv4(),
      nama_acara: nama_acara,
      tanggal: tanggal,
      waktu_mulai: waktu_mulai,
      waktu_selesai: waktu_berakhir,
      deskripsi: deskripsi,
      lokasi: lokasi,
      pembuat_acara: acara,
      status: status,
    }
    await db.Informasi.create(sendData)
    
    req.flash('success', 'Data berhasil disimpan.');
    res.redirect(`/dasbor/master/imunisasi`)
  } catch (error) {
    req.flash('error', error.message);
    res.redirect(`/dasbor/master/imunisasi`)
  }
})

module.exports = router

