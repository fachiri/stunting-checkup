const db = require('../../models')
const express = require('express')
const { Op } = require('sequelize');

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const { keywords } = req.query

    const data = await db.Balita.findAll({
      where: {
        nama: {
          [Op.like]: `%${keywords}%`,
        },
      },
    });

    if (!data || data.length === 0) {
      throw {code: 404, message: 'Data tidak ditemukan'}
    }

    res.status(200).send({
      success: true,
      message: 'Fetch data berhasil.',
      data
    })
  } catch (error) {
    console.log(error)
    res.status(error.code || 500).send({
      success: false,
      message: error.message,
      data: {}
    })
  }
})

module.exports = router

