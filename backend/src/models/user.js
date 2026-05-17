const { Model, DataTypes } = require('sequelize');

class User extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
      },
      senha: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      sequelize,
      tableName: 'users',
      timestamps: true,
      underscored: false,
    });
  }

  static associate(models) {
    this.hasMany(models.Trade, { foreignKey: 'sender_id', as: 'sentTrades' });
    this.hasMany(models.Trade, { foreignKey: 'receiver_id', as: 'receivedTrades' });
  }
}

module.exports = User;