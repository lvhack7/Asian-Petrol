// Supplier Model (models/supplier.js)
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Deal = require('./deal');

const Supplier = sequelize.define('Supplier', {
  name: { type: DataTypes.TEXT },
  contractNumber: { type: DataTypes.TEXT },
  volume: { type: DataTypes.TEXT },
  amount: { type: DataTypes.TEXT },
  deliveryBasis: { type: DataTypes.TEXT },
  fixationCondition: { type: DataTypes.TEXT },
  quotation: { type: DataTypes.TEXT },
  discount: { type: DataTypes.TEXT },
  price: { type: DataTypes.TEXT },
  volumeFilled: { type: DataTypes.TEXT },
  fillDate: { type: DataTypes.DATE }
});

Supplier.belongsTo(Deal, { foreignKey: 'dealId' });
module.exports = Supplier;