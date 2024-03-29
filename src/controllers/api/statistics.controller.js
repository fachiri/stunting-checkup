const db = require('../../models')
const express = require('express')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    // const countMale = await db.Checkup.count({ where: { jk: 1, } })
    // const countMaleStunting = await db.Checkup.count({ where: { jk: 1, label: 1 } })
    // const countMaleTidakStunting = await db.Checkup.count({ where: { jk: 1, label: 0 } })
    // const countFemale = await db.Checkup.count({ where: { jk: 0, } })
    // const countFemaleStunting = await db.Checkup.count({ where: { jk: 0, label: 1 } })
    // const countFemaleTidakStunting = await db.Checkup.count({ where: { jk: 0, label: 0 } })
    const countMale = await db.Balita.count({
      where: { jenis_kelamin: 'Laki-laki' }
    });

    const countMaleStunting = await db.Balita.count({
      where: { jenis_kelamin: 'Laki-laki' },
      include: [{
        model: db.Imunisasi,
        include: {
          model: db.Checkup,
          where: { label: 1 }
        }
      }],
    });

    const countMaleTidakStunting = await db.Balita.count({
      where: { jenis_kelamin: 'Laki-laki' },
      include: [{
        model: db.Imunisasi,
        include: {
          model: db.Checkup,
          where: { label: 0 }
        }
      }],
    });

    const countFemale = await db.Balita.count({
      where: { jenis_kelamin: 'Perempuan' }
    });

    const countFemaleStunting = await db.Balita.count({
      where: { jenis_kelamin: 'Perempuan' },
      include: [{
        model: db.Imunisasi,
        include: {
          model: db.Checkup,
          where: { label: 1 }
        }
      }],
    });

    const countFemaleTidakStunting = await db.Balita.count({
      where: { jenis_kelamin: 'Perempuan' },
      include: [{
        model: db.Imunisasi,
        include: {
          model: db.Checkup,
          where: { label: 0 }
        }
      }],
    });

    res.status(200).send({
      success: true,
      message: 'Fetch data berhasil.',
      data: {
        countMale,
        countMaleStunting,
        countMaleTidakStunting,
        countFemale,
        countFemaleStunting,
        countFemaleTidakStunting
      }
    })
  } catch (error) {
    res.status(error.code || 500).send({
      success: false,
      message: error.message,
      data: {}
    })
  }
})

module.exports = router

