const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Deal = require('./deal');

const Buyer = sequelize.define('Buyer', {
  name: { type: DataTypes.TEXT },
  contractNumber: { type: DataTypes.TEXT },
  volume: { type: DataTypes.TEXT },
  amount: { type: DataTypes.TEXT },
  deliveryBasis: { type: DataTypes.TEXT },
  fixationCondition: { type: DataTypes.TEXT },
  declared: { type: DataTypes.TEXT },
  dischargeVolume: { type: DataTypes.TEXT },
  dischargeDate: { type: DataTypes.DATE }
});

Buyer.belongsTo(Deal, { foreignKey: 'dealId' });
module.exports = Buyer;