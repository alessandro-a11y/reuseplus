const { Model, DataTypes } = require('sequelize');

class Item extends Model {
  static init(sequelize) {
    super.init({
      titulo: DataTypes.STRING,
      descricao: DataTypes.TEXT,
      categoria: DataTypes.STRING,
      status: {
        type: DataTypes.STRING,
        defaultValue: 'disponivel'
      },
      userId: DataTypes.INTEGER
    }, {
      sequelize,
      tableName: 'items',
      underscored: false,
    });
  }

  static associate(models) {
    this.hasMany(models.Trade, { foreignKey: 'item_id', as: 'trades' });
  }
}

module.exports = Item;
