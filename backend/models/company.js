const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Deal = require('./Deal');

const CompanyGroup = sequelize.define('CompanyGroup', {
    names: {type: DataTypes.TEXT},
    applicationNumber: {type: DataTypes.TEXT},
    price: {type: DataTypes.TEXT},
    comment: {type: DataTypes.TEXT},
});

CompanyGroup.belongsTo(Deal, {foreignKey: 'dealId'})
module.exports = CompanyGroup;