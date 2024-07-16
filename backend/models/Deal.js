const { DataTypes } = require('sequelize')
const db = require('../db.js')

const Deal = db.define('deals', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    name: {
        type: DataTypes.TEXT,
        unique: true,
        allowNull: false
    },
    amount: {
        type: DataTypes.INTEGER,
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.TEXT,
        allowNull: false
    }
})

module.exports = Deal
