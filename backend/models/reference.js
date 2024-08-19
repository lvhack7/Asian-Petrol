const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reference = sequelize.define('Reference', {
    name: { type: DataTypes.TEXT },
    field: {type: DataTypes.TEXT}
});

module.exports = Reference;