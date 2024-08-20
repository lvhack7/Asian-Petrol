const {Sequelize} = require('sequelize')

const sequelize = new Sequelize('asian-db', 'postgres', 'hacki1711*', {
  host: 'localhost',
  dialect: 'postgres',
})

module.exports = sequelize