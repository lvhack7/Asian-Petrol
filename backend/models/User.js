const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  username: { type: DataTypes.TEXT, unique: true },
  password: { type: DataTypes.TEXT },
  role: { type: DataTypes.TEXT } // 'Admin', 'Manager', 'Logist'
});

module.exports = User;