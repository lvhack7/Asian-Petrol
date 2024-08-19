const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Supplier = require('./supplier');
const Deal = require('./deal');
const Forwarder = require('./forwarder');

const Price = sequelize.define('Price', {
    quotation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    discount: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    commentary: {
      type: DataTypes.STRING,
    },
});

module.exports = Price;