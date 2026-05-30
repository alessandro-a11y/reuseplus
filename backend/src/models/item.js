const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Item = sequelize.define('Item', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM('novo', 'usado', 'danificado'),
    defaultValue: 'usado'
  },
  disponivel: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  imagem_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  }
}, {
  tableName: 'items',
  timestamps: true
});

Item.belongsTo(User, { foreignKey: 'usuario_id', as: 'dono' });
User.hasMany(Item, { foreignKey: 'usuario_id', as: 'items' });

module.exports = Item;