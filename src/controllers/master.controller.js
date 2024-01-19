const { validateStoreBalita, validateUpdateBalita, validateStoreKader, validateUpdateKader } = require('../middlewares/validation');
const db = require('../models')
const express = require('express')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs');
const algorithmUtil = require('../utils/algorithm.util');

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

router.post('/balita/:uuid/checkup', async (req, res) => {
  try {
    const data = await db.Balita.findOne({
      where: {
        uuid: req.params.uuid
      }
    });

    if (!data) {
      throw new Error('Data tidak ditemukan')
    }
    
    const jk = data.jenis_kelamin = 'Laki-laki' ? 1 : 0
    const { predict_result, predict_accuracy, predict_proba_x, predict_proba_y } = await algorithmUtil.decisionTreeClassifier(+data.berat_badan, +data.tinggi_badan, +data.umur, jk)

    await db.Checkup.create({
      age: data.umur,
      bb: data.berat_badan,
      tb: data.tinggi_badan,
      jk,
      label: predict_result,
      accuracy: predict_accuracy,
      masterBalitumId: data.id
    })

    data.update({
      status_checkup: 'Sudah Checkup'
    })

    req.flash('success', 'Checkup berhasil.');
  } catch (error) {
    req.flash('error', error.message);
  } finally {
    res.redirect(`/dasbor/master/balita/${req.params.uuid}`)
  }
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

    await db.Checkup.destroy({
      where: {
        masterBalitumId: data.id
      }
    });

    await data.destroy()

    req.flash('success', 'Data balita berhasil dihapus.');
    res.redirect(`/dasbor/master/balita`)
  } catch (error) {
    console.log(error)
    req.flash('error', error.message);
    res.redirect(`/dasbor/master/balita`)
  }
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

router.get('/balita/print/preview', async (req, res) => {
  let data = {}

  data.balita = await db.Balita.findAll();

  res.render('./pages/dashboard/print/balita', {
    layout: 'layouts/print',
    data
  })
})

router.get('/informasi/print/preview', async (req, res) => {
  let data = {}

  data.informasi = await db.Informasi.findAll();

  res.render('./pages/dashboard/print/informasi', {
    layout: 'layouts/print',
    data
  })
})

router.get('/kader', async (req, res) => {
  const kaders = await db.User.findAll({
    where: {
      role: 'KADER'
    }
  });

  const data = {
    kader: kaders
  }

  res.render('./pages/dashboard/master/kader', {
    title: 'Master Kader',
    layout: 'layouts/dashboard',
    successMessages: req.flash('success'),
    errorMessages: req.flash('error'),
    oldData: req.flash('form'),
    data
  })
})

router.post('/kader', validateStoreKader, async (req, res) => {
  try {
    const { name, username, nama_puskesmas, kecamatan_puskesmas } = req.body
    await db.User.create({
      name,
      username,
      role: 'KADER',
      password: bcrypt.hashSync(username),
      kecamatan_puskesmas,
      nama_puskesmas
    })

    req.flash('success', 'Data Kader berhasil disimpan.');
    res.redirect(`/dasbor/master/kader`)
  } catch (error) {
    req.flash('error', error.message);
    res.redirect(`/dasbor/master/kader`)
  }
})

router.get('/kader/:uuid/delete', async (req, res) => {
  try {
    const data = await db.User.findOne({
      where: {
        uuid: req.params.uuid
      }
    });

    if (!data) {
      throw new Error('Data tidak ditemukan')
    }

    data.destroy()

    req.flash('success', 'Data kader berhasil dihapus.');
    res.redirect(`/dasbor/master/kader`)
  } catch (error) {
    req.flash('error', error.message);
    res.redirect(`/dasbor/master/kader`)
  }
})

router.get('/kader/:uuid', async (req, res) => {
  const dataKader = await db.User.findOne({
    where: {
      uuid: req.params.uuid
    }
  });

  const data = {
    kader: dataKader
  }

  res.render('./pages/dashboard/master/kader-detail', {
    title: 'Detail Kader',
    layout: 'layouts/dashboard',
    successMessages: req.flash('success'),
    errorMessages: req.flash('error'),
    oldData: req.flash('form'),
    data
  })
})

router.post('/kader/:uuid/update', validateUpdateKader, async (req, res) => {
  try {
    const data = await db.User.findOne({
      where: {
        uuid: req.params.uuid
      }
    });

    if (!data) {
      throw new Error('Data tidak ditemukan')
    }

    data.update(req.body)

    req.flash('success', 'Data kader berhasil diedit.');
    res.redirect(`/dasbor/master/kader/${data.uuid}`)
  } catch (error) {
    console.log(error)
    req.flash('error', error.message);
    res.redirect(`/dasbor/master/kader`)
  }
})

module.exports = router

