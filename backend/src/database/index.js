'use strict';
const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig.url, {
  dialect: dbConfig.dialect,
  dialectOptions: dbConfig.dialectOptions,
  define: dbConfig.define,
  logging: false,
});

const User = require('../models/User');
const Item = require('../models/Item');
const Trade = require('../models/Trade');

User.init(sequelize);
Item.init(sequelize);
Trade.init(sequelize);

const models = { User, Item, Trade };

Object.values(models).forEach(model => {
  if (model.associate) model.associate(models);
});

module.exports = sequelize;