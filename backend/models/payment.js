const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
    payment: {
      type: DataTypes.FLOAT,
    },
    date: {
      type: DataTypes.DATE,
    },
});

module.exports = Payment;