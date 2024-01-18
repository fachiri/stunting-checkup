const db = require('./../models')
const express = require('express')
const bcrypt = require('bcryptjs')

const router = express.Router()

router.get('/', async (req, res) => {
  let data = {}

  data.totalBalitaCount = await db.Balita.count();
  data.lengkapBalitaCount = await db.Balita.count({
    where: {
      status_imunisasi: 'Lengkap',
    },
  });
  data.belumLengkapBalitaCount = await db.Balita.count({
    where: {
      status_imunisasi: 'Belum lengkap',
    },
  });
  data.user = await db.User.findOne({
    where: {
      uuid: req.session.user.uuid
    }
  });
  data.toddlers = await db.Balita.findAll({
    order: [['createdAt', 'DESC']],
    limit: 5,
  });

  res.render('./pages/dashboard', {
    title: 'Dasbor',
    layout: 'layouts/dashboard',
    data,
    successMessages: req.flash('success'),
    errorMessages: req.flash('error'),
  })
})

router.get('/checkup', async (req, res) => {
  let data = {}

  data.checkups = await db.Checkup.findAll({
    include: db.Balita
  });

  res.render('./pages/dashboard/checkup', {
    title: 'Rekap Checkup',
    layout: 'layouts/dashboard',
    data,
    successMessages: req.flash('success'),
    errorMessages: req.flash('error'),
  })
})

router.get('/checkup/print/preview', async (req, res) => {
  let data = {}

  data.checkup = await db.Checkup.findAll({
    include: db.Balita
  });

  res.render('./pages/dashboard/print/checkup', { 
    layout: 'layouts/print',
    data 
  })
})

router.get('/pengaturan', async (req, res) => {
  let data = {}

  data.user = await db.User.findOne({
    where: {
      uuid: req.session.user.uuid
    }
  });

  res.render('./pages/dashboard/pengaturan', {
    title: 'Pengaturan',
    layout: 'layouts/dashboard',
    data,
    successMessages: req.flash('success'),
    errorMessages: req.flash('error')
  })
})

router.post('/pengaturan/update-user/:uuid', async (req, res) => {
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

    req.flash('success', 'Data berhasil diupdate.');
    res.redirect(`/dasbor/pengaturan`)
  } catch (error) {
    console.log(error)
    req.flash('error', error.message);
    res.redirect(`/dasbor/pengaturan`)
  }
})

router.post('/pengaturan/change-password/:uuid', async (req, res) => {
  try {
    const data = await db.User.findOne({
      where: {
        uuid: req.params.uuid
      }
    });

    if (!data) {
      throw new Error('Data tidak ditemukan')
    }

    const { password_lama, password_baru, konfirmasi_password_baru } = req.body;

    // Check if the provided old password matches the stored hashed password
    const isPasswordValid = await bcrypt.compare(password_lama, data.password);

    if (!isPasswordValid) {
      throw new Error('Password lama tidak valid');
    }

    // Check if the new password and confirmation match
    if (password_baru !== konfirmasi_password_baru) {
      throw new Error('Konfirmasi password baru tidak sesuai');
    }

    // Hash the new password before updating
    const hashedPassword = await bcrypt.hash(password_baru, 10);

    // Update the user's password in the database
    await db.User.update(
      { password: hashedPassword },
      {
        where: {
          uuid: req.params.uuid,
        },
      }
    );

    req.flash('success', 'Password berhasil diupdate.');
    res.redirect(`/dasbor/pengaturan`)
  } catch (error) {
    console.log(error)
    req.flash('error', error.message);
    res.redirect(`/dasbor/pengaturan`)
  }
})

router.get('/logout', async (req, res) => {
  try {
    // Destroy the session to log the user out
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        req.flash('error', 'Failed to log out');
        res.redirect(`/dasbor`);
      } else {
        res.redirect(`/auth/login`);
      }
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to log out');
    res.redirect(`/dasbor`);
  }
});

module.exports = router

