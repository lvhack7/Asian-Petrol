const {Sequelize} = require('sequelize')

const db = new Sequelize("database", "user", "password", {
    dialect: 'sqlite',
    host: 'localhost',
    storage: 'database.sqlite',
    logging: false
})

module.exports = db