const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tonn = sequelize.define('Tonn', {
    tonn: {
      type: DataTypes.STRING,
    },
    date: {
      type: DataTypes.DATE,
    },
});

module.exports = Tonn;