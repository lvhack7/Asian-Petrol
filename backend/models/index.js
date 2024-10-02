const sequelize = require('../config/database');
const User = require('./User');
const Deal = require('./Deal');
const Supplier = require('./supplier');
const Buyer = require('./buyer');
const Forwarder = require('./forwarder');
const CompanyGroup = require('./company');
const Reference = require('./reference');
const Price = require('./price');
const Tonn = require('./tonn')

// Define associations
Deal.hasOne(Supplier, { foreignKey: 'dealId' });
Deal.hasOne(Buyer, { foreignKey: 'dealId' });
Deal.hasOne(Forwarder, { foreignKey: 'dealId' });
Deal.hasOne(CompanyGroup, { foreignKey: 'dealId' })

Supplier.hasMany(Price, {foreignKey: 'supplierId'})
Price.belongsTo(Supplier, {foreignKey: 'supplierId'})

Supplier.hasMany(Tonn, {foreignKey: 'supplierId'})
Tonn.belongsTo(Supplier, {foreignKey: 'supplierId'})

Buyer.hasMany(Price, {foreignKey: 'buyerId'})
Price.belongsTo(Buyer, {foreignKey: 'buyerId'})

Buyer.hasMany(Tonn, {foreignKey: 'buyerId'})
Tonn.belongsTo(Buyer, {foreignKey: 'buyerId'})

CompanyGroup.hasMany(Price, {foreignKey: 'companyId'})
Price.belongsTo(CompanyGroup, {foreignKey: 'companyId'})

module.exports = { sequelize, User, Deal, Supplier, Buyer, Forwarder, CompanyGroup, Reference, Price, Tonn };
