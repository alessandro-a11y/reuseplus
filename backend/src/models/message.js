const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User  = require('./user');
const Trade = require('./trade');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  trade_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'trades', key: 'id' }
  },
  remetente_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  texto: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 2000]
    }
  },
  lida: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'messages',
  timestamps: true
});

Message.belongsTo(Trade, { foreignKey: 'trade_id',     as: 'trade' });
Message.belongsTo(User,  { foreignKey: 'remetente_id', as: 'remetente' });

Trade.hasMany(Message, { foreignKey: 'trade_id',     as: 'mensagens' });
User.hasMany(Message,  { foreignKey: 'remetente_id', as: 'mensagens' });

module.exports = Message;