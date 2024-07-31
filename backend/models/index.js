const sequelize = require('../config/database');
const User = require('./user');
const Deal = require('./deal');
const Supplier = require('./supplier');
const Buyer = require('./buyer');
const Forwarder = require('./forwarder');
const CompanyGroup = require('./company');

// Define associations
Deal.hasOne(Supplier, { foreignKey: 'dealId' });
Deal.hasOne(Buyer, { foreignKey: 'dealId' });
Deal.hasOne(Forwarder, { foreignKey: 'dealId' });
Deal.hasOne(CompanyGroup, { foreignKey: 'dealId' })

module.exports = { sequelize, User, Deal, Supplier, Buyer, Forwarder, CompanyGroup };