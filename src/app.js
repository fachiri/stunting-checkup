const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const middlewares = require('./middlewares');
// const routeWeb = require('./routes/web');
const routeApi = require('./routes/api.route');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

// app.use('/', routeWeb);
app.use('/api', routeApi);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;