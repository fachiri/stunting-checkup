const { UUIDV4 } = require('sequelize')
const db = require('../models')
const express = require('express')
const {v4:uuidv4} = require('uuid')

const router = express.Router()

router.get('/balita', async (req, res) => {
  res.render('./pages/dashboard/master/balita', { title: 'Master Balita', layout: 'layouts/dashboard' })
})

router.get('/imunisasi', async (req, res) => {
  const data = await db.Informasi.findAll();
  res.render('./pages/dashboard/master/imunisasi', { title: 'Master Imunisasi', layout: 'layouts/dashboard',informasi:data })
})

router.post('/imunisasi', async (req,res ) => {
  const { lokasi,acara,status,nama_acara, tanggal, waktu_mulai, waktu_berakhir,deskripsi } = req.body
  try{
    const sendData = {
      uuid:uuidv4(),
      nama_acara:nama_acara,
      tanggal:tanggal,
      waktu_mulai:waktu_mulai,
      waktu_selesai:waktu_berakhir,
      deskripsi:deskripsi,
      lokasi:lokasi,
      pembuat_acara:acara,
      status:status, 
    }
    const send = await db.Informasi.create(sendData)
    res.send("berhasil");
  }catch(error)
  {
    res.send(error)
  }
})

module.exports = router

