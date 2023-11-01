const db = require('./../../models')
const express = require('express')

const route = express.Router()

route.get('/', async (req, res)=>{
    const data = await db.Informasi.findAll({where: {status: 'Aktif'}});
    return res.json(data);
})

module.exports = route