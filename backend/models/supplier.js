// Supplier Model (models/supplier.js)
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Deal = require('./deal');

const Supplier = sequelize.define('Supplier', {
  name: { type: DataTypes.STRING },
  contractNumber: { type: DataTypes.STRING },
  volume: { type: DataTypes.FLOAT },
  amount: { type: DataTypes.FLOAT },
  deliveryBasis: { type: DataTypes.STRING },
  fixationCondition: { type: DataTypes.STRING },
  quotation: { type: DataTypes.FLOAT },
  discount: { type: DataTypes.FLOAT },
  price: { type: DataTypes.FLOAT },
  volumeFilled: { type: DataTypes.FLOAT },
  fillDate: { type: DataTypes.DATE }
});

Supplier.belongsTo(Deal, { foreignKey: 'dealId' });
module.exports = Supplier;