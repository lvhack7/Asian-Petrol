const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Deal = require('./Deal');

const Buyer = sequelize.define('Buyer', {
  name: { type: DataTypes.TEXT },
  contractNumber: { type: DataTypes.TEXT },
  volume: { type: DataTypes.TEXT },
  amount: { type: DataTypes.TEXT },
  deliveryBasis: { type: DataTypes.TEXT },
  fixationCondition: { type: DataTypes.TEXT },
  declared: { type: DataTypes.TEXT },
  paymentDate: { type: DataTypes.DATE },
  payment: {type: DataTypes.FLOAT},
  dischargeVolume: { type: DataTypes.TEXT },
  dischargeDate: { type: DataTypes.DATE },
  fillTon: { type: DataTypes.TEXT },
  fillDate: { type: DataTypes.DATE },
  unloadVolume: { type: DataTypes.TEXT },
  unloadDate:  { type: DataTypes.DATE }
});

Buyer.belongsTo(Deal, { foreignKey: 'dealId' });
module.exports = Buyer;