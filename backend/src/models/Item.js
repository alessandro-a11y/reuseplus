const { Model, DataTypes } = require('sequelize');

class Item extends Model {
  static init(sequelize) {
    super.init({
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      user_id: DataTypes.INTEGER,
    }, {
      sequelize,
      tableName: 'items',
      underscored: true,
    });
  }

  static associate(models) {
    this.hasMany(models.Trade, { foreignKey: 'item_id', as: 'trades' });
  }
}

module.exports = Item;
