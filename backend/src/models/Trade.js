const { Model, DataTypes } = require('sequelize');

class Trade extends Model {
  static init(sequelize) {
    super.init({
      status: {
        type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'completed', 'canceled'),
        defaultValue: 'pending',
        allowNull: false
      },
      sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      receiver_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      item_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      sequelize,
      tableName: 'trades',
      underscored: true,
    });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'sender_id', as: 'sender' });
    this.belongsTo(models.User, { foreignKey: 'receiver_id', as: 'receiver' });
  }
}

module.exports = Trade;