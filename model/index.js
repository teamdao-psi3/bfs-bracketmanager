const dbConfig = require('../config/mysql.config')
const { Sequelize, DataType } = require('sequelize')

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASS, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.user = require('./user.model.js')(sequelize)
db.tournament = require('./tournament.model.js')(sequelize)

module.exports = db