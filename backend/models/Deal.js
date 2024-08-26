const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Deal = sequelize.define('Deal', {
  dealNumber: { type: DataTypes.INTEGER, unique: true },
  date: { type: DataTypes.DATE },
  factory: { type: DataTypes.STRING },
  fuelType: { type: DataTypes.STRING },
  sulfur: {type: DataTypes.STRING},
  type: {type: DataTypes.STRING}
});

module.exports = Deal;