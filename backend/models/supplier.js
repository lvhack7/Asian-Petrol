// Supplier Model (models/supplier.js)
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Deal = require('./Deal');
const Price = require('./price');

const Supplier = sequelize.define('Supplier', {
  name: { type: DataTypes.TEXT },
  contractNumber: { type: DataTypes.TEXT },
  volume: { type: DataTypes.TEXT },
  amount: { type: DataTypes.TEXT },
  deliveryBasis: { type: DataTypes.TEXT },
  fixationCondition: { type: DataTypes.TEXT },
  fillTon: { type: DataTypes.TEXT },
  fillDate: { type: DataTypes.DATE },
});

Supplier.belongsTo(Deal, { foreignKey: 'dealId' });
module.exports = Supplier;