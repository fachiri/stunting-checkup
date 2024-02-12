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
db.Imunisasi = require("./imunisasi.model.js")(sequelize, Sequelize)

db.Balita.hasMany(db.Imunisasi, { onDelete: 'CASCADE' });
db.Imunisasi.belongsTo(db.Balita);
db.Imunisasi.hasOne(db.Checkup, { onDelete: 'CASCADE' });
db.Checkup.belongsTo(db.Imunisasi);

module.exports = db