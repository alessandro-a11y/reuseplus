const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Item = require('./item');

const Favorite = sequelize.define('Favorite', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  item_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'items', key: 'id' }
  }
}, {
  tableName: 'favorites',
  timestamps: true,
  indexes: [
    // Impede duplicata: mesmo usuário não pode favoritar o mesmo item duas vezes
    { unique: true, fields: ['usuario_id', 'item_id'] }
  ]
});

Favorite.belongsTo(User, { foreignKey: 'usuario_id', as: 'usuario' });
Favorite.belongsTo(Item, { foreignKey: 'item_id',    as: 'item' });
User.hasMany(Favorite,   { foreignKey: 'usuario_id', as: 'favoritos' });
Item.hasMany(Favorite,   { foreignKey: 'item_id',    as: 'favoritadoPor' });

module.exports = Favorite;
