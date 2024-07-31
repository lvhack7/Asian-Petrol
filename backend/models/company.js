const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CompanyGroup = sequelize.define('CompanyGroup', {
    name: {type: DataTypes.TEXT},
    applicationNumber: {type: DataTypes.TEXT},
    price: {type: DataTypes.TEXT},
    comment: {type: DataTypes.TEXT},
});

module.exports = CompanyGroup;