const { Model, DataTypes } = require('sequelize');

class Trade extends Model {
  static init(sequelize) {
    super.init({
      status: {
        type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'completed', 'canceled'),
        defaultValue: 'pending',
        allowNull: false
      }
    }, {
      sequelize,
      tableName: 'trades', // Nome da tabela no banco (geralmente em minúsculo no Postgres)
      underscored: true,   // Garante o padrão snake_case (created_at, updated_at)
    });
  }

  static associate(models) {
    // Relacionamento 1: Quem está pedindo a troca (Sender)
    this.belongsTo(models.User, { foreignKey: 'sender_id', as: 'sender' });
    
    // Relacionamento 2: Quem é o dono do item e vai receber o pedido (Receiver)
    this.belongsTo(models.User, { foreignKey: 'receiver_id', as: 'receiver' });
    
    // Relacionamento 3: Qual é o item que está sendo negociado
    this.belongsTo(models.Item, { foreignKey: 'item_id', as: 'item' });
  }
}

module.exports = Trade;