const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Price = sequelize.define('Price', {
    quotation: {
      type: DataTypes.STRING,
    },
    discount: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.STRING,
    },
    currency: {
      type: DataTypes.STRING,
    },
    commentary: {
      type: DataTypes.STRING,
    },
});

module.exports = Price;