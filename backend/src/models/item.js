const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Item = sequelize.define('Item', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'disponivel',
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Item.associate = (models) => {
  Item.belongsTo(models.User, { foreignKey: 'userId' });
};

module.exports = Item;