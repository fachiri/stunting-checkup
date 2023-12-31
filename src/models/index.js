const Sequelize = require("sequelize")
const config = require('./../config/keys').db
const sequelize = new Sequelize(
  config.name,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect
  }
)

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.Checkup = require("./checkup.model.js")(sequelize, Sequelize)
db.Balita = require("./balita.model.js")(sequelize, Sequelize)
db.User = require("./user.model.js")(sequelize, Sequelize)
db.Informasi = require("./informasi.model.js")(sequelize, Sequelize)

module.exports = db