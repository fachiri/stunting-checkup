const { UUIDV4 } = require('sequelize')
const db = require('../models')
const express = require('express')
const {v4:uuidv4} = require('uuid')
const session = require('express')

const router = express.Router()

router.get('/balita', async (req, res) => {
  const data = db.Checkup.findAll()
  res.render('./pages/dashboard/master/balita', { title: 'Master Balita', layout: 'layouts/dashboard'})
})

router.get('/imunisasi', async (req, res) => {
  const data = await db.Informasi.findAll();

  res.render('./pages/dashboard/master/imunisasi', { title: 'Master Imunisasi', layout: 'layouts/dashboard',informasi:data })
})
router.get('/imunisasi/:id', async (req, res) => {
  const data = await db.Informasi.findAll({where: {uuid:req.params.id}}); 
  res.render('./pages/dashboard/master/editInformasi',{ title: 'Master Informasi Imunisasi', layout: 'layouts/dashboard' ,data:data})
})


router.post('/imunisasi/hapus/:id',async (req,res) => {
  try{
    await db.Informasi.destroy({where: {uuid:req.params.id}});
    res.redirect('/dasbor/master/imunisasi');
  }catch(error)
  {
    res.redirect('/dasbor/master/imunisasi');
  }
})
router.post('/imunisasi/edit/:id',async (req,res) => {
    try{
      await db.Informasi.update(req.body,{where: {id:req.params.id}});
      res.redirect('/dasbor/master/imunisasi');
    }catch(error)
    {
      res.redirect('/dasbor/master/imunisasi');
    }
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

