const { Model, DataTypes } = require('sequelize');

class User extends Model {
  static init(sequelize) {
    super.init({
      nome: DataTypes.STRING,
      email: DataTypes.STRING,
      senha: DataTypes.STRING,
    }, {
      sequelize,
      tableName: 'users',
      underscored: false,
    });
  }

  static associate(models) {
    this.hasMany(models.Trade, { foreignKey: 'sender_id', as: 'sentTrades' });
    this.hasMany(models.Trade, { foreignKey: 'receiver_id', as: 'receivedTrades' });
  }
}

module.exports = User;