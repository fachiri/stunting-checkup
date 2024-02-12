const db = require('./../../models')
const express = require('express')
const algorithmUtil = require('./../../utils/algorithm.util')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;

    const offset = (page - 1) * itemsPerPage;

    const checkups = await db.Checkup.findAll({
      offset,
      limit: itemsPerPage,
    });

    const totalItems = await db.Checkup.count();
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const baseUrl = req.originalUrl.split('/')[2];
    const nextPage = `/${baseUrl}?page=${page + 1}`;
    const previousPage = page > 1 ? `/${baseUrl}?page=${page - 1}` : null;

    res.status(200).send({
      success: true,
      message: 'Fetch data berhasil.',
      data: {
        checkups,
        pagination: {
          totalItems,
          totalPages,
          currentPage: page,
          itemsPerPage,
          nextPage,
          previousPage,
        }
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

router.post('/', async (req, res) => {
  try {
    const { name, address, age, bb, tb, jk } = req.body

    const { predict_result, predict_accuracy, predict_proba_x, predict_proba_y } = await algorithmUtil.decisionTreeClassifier(+bb, +tb, +age, +jk)

    await db.Checkup.create({
      name,
      address,
      age,
      bb,
      tb,
      jk,
      label: predict_result,
      accuracy: predict_accuracy
    })

    res.status(200).send({
      success: true,
      message: 'Pemeriksaan berhasil.',
      data: {
        predict_result,
        predict_accuracy,
        predict_proba_x,
        predict_proba_y
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

router.get('/:uuid', async (req, res) => {
  try {
    const data = await db.Balita.findOne({
      where: {
        uuid: req.params.uuid
      },
      include: {
        model: db.Imunisasi,
        include: db.Checkup,
      }
    })

    if (!data || data.length === 0) {
      throw {code: 404, message: 'Data tidak ditemukan'}
    }

    res.status(200).send({
      success: true,
      message: 'Fetch data berhasil.',
      data
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

