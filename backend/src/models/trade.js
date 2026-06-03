const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Item = require('./item');

const Trade = sequelize.define('Trade', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  status: {
    type: DataTypes.ENUM('pendente', 'aceita', 'recusada', 'concluida'),
    defaultValue: 'pendente'
  },
  mensagem: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  solicitante_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  receptor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  item_oferecido_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'items', key: 'id' }
  },
  item_desejado_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'items', key: 'id' }
  },
  // ✅ NOVO: campos para confirmação dupla de conclusão
  confirmado_solicitante: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  confirmado_receptor: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'trades',
  timestamps: true
});

Trade.belongsTo(User, { foreignKey: 'solicitante_id',    as: 'solicitante' });
Trade.belongsTo(User, { foreignKey: 'receptor_id',       as: 'receptor' });
Trade.belongsTo(Item, { foreignKey: 'item_oferecido_id', as: 'itemOferecido' });
Trade.belongsTo(Item, { foreignKey: 'item_desejado_id',  as: 'itemDesejado' });

module.exports = Trade;