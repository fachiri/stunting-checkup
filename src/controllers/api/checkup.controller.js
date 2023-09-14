const express = require('express')
const algorithmUtil = require('../../utils/algorithm.util')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    res.status(200).send({
      success: true,
      message: 'Test lehhhh.',
      data: {}
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

    const { predict_result, predict_accuracy, predict_proba_x, predict_proba_y } = await algorithmUtil.prediction(+bb, +tb, +age, +jk)

    res.status(200).send({
      success: true,
      message: 'Klasifikasi berhasil.',
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

module.exports = router

