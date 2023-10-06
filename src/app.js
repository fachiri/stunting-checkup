const path = require('path')
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const expressLayouts = require('express-ejs-layouts')

const middlewares = require('./middlewares')
const routeWeb = require('./routes/web.route')
const routeApi = require('./routes/api.route')

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ limit: "10mb", extended: true }))

app.set('views', path.join(__dirname, '/views'));
app.set("view engine", "ejs")
app.use(expressLayouts)
app.use(express.static(path.join(__dirname, '/../public')))

app.set('trust proxy', 1)

const limiter = rateLimit({
  windowMs: 60000,
  max: 12,
  message: {
    success: false,
    message: 'Terlalu banyak permintaan. Silakan coba lagi nanti.',
    data: {},
  },
})

app.use('/', routeWeb)
app.use('/api', limiter, routeApi)

app.use(middlewares.notFound)
app.use(middlewares.errorHandler)

module.exports = app