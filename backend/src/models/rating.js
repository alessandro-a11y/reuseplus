const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User  = require('./user');
const Trade = require('./trade');

const Rating = sequelize.define('Rating', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // quem avaliou
  avaliador_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  // quem foi avaliado
  avaliado_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  // troca que originou a avaliação
  trade_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'trades', key: 'id' }
  },
  nota: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  comentario: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'ratings',
  timestamps: true,
  // um usuário só pode avaliar o outro uma vez por troca
  indexes: [
    { unique: true, fields: ['avaliador_id', 'trade_id'] }
  ]
});

Rating.belongsTo(User,  { foreignKey: 'avaliador_id', as: 'avaliador' });
Rating.belongsTo(User,  { foreignKey: 'avaliado_id',  as: 'avaliado' });
Rating.belongsTo(Trade, { foreignKey: 'trade_id',     as: 'trade' });

User.hasMany(Rating,  { foreignKey: 'avaliado_id',  as: 'avaliacoesRecebidas' });
User.hasMany(Rating,  { foreignKey: 'avaliador_id', as: 'avaliacoesDadas' });
Trade.hasMany(Rating, { foreignKey: 'trade_id',     as: 'avaliacoes' });

module.exports = Rating;