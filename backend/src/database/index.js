const sequelize = require('../config/database');
const User = require('../models/user');
const Trade = require('../models/trade');

User.init(sequelize);
Trade.init(sequelize);

const models = { User, Trade };

Object.values(models).forEach(model => {
  if (model.associate) model.associate(models);
});

sequelize.sync({ alter: true });

module.exports = { sequelize, models };