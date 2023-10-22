const db = require('../models')
const express = require('express')

const router = express.Router()

router.get('/balita', async (req, res) => {
  const dataBalita = [
    {
      nama: "Anya",
      jenis_kelamin: "Perempuan",
      berat_badan: 8,
      tinggi_badan: 70,
      status_imunisasi: "Lengkap",
      umur: 12
    },
    {
      nama: "Bima",
      jenis_kelamin: "Laki-laki",
      berat_badan: 9,
      tinggi_badan: 72,
      status_imunisasi: "Belum lengkap",
      umur: 14
    },
    {
      nama: "Citra",
      jenis_kelamin: "Perempuan",
      berat_badan: 7,
      tinggi_badan: 68,
      status_imunisasi: "Lengkap",
      umur: 10
    },
    {
      nama: "Damar",
      jenis_kelamin: "Laki-laki",
      berat_badan: 8,
      tinggi_badan: 71,
      status_imunisasi: "Belum lengkap",
      umur: 13
    },
    {
      nama: "Eva",
      jenis_kelamin: "Perempuan",
      berat_badan: 8,
      tinggi_badan: 69,
      status_imunisasi: "Lengkap",
      umur: 11
    },
  ];

  const data = {
    balita: dataBalita
  }

  res.render('./pages/dashboard/master/balita', {
    title: 'Master Balita',
    layout: 'layouts/dashboard',
    successMessages: req.flash('success'),
    errorMessages: req.flash('error'),
    data
  })
})

router.post('/balita', async (req, res) => {
  try {
    const data = await db.Balita.create(req.body)
    req.flash('success', 'Data balita berhasil disimpan.');
    res.redirect(`/dasbor/master/balita/${data.uuid}`)
  } catch (error) {
    console.log(error)
    req.flash(error.message, 'Terjadi kesalahan saat menyimpan data.');
    res.redirect(`/dasbor/master/balita`)
  }
})

router.get('/imunisasi', async (req, res) => {
  res.render('./pages/dashboard/master/imunisasi', { title: 'Master Imunisasi', layout: 'layouts/dashboard' })
})

module.exports = router

