const { Op } = require('sequelize');
const Trade = require('../models/Trade');
const User = require('../models/user');
const Item = require('../models/Item');

class TradeService {

  async createTrade({ sender_id, receiver_id, item_id }) {
    if (Number(sender_id) === Number(receiver_id)) {
      throw new Error('Você não pode propor uma troca para si mesmo.');
    }

    const existingTrade = await Trade.findOne({
      where: { item_id, sender_id, status: 'pending' }
    });

    if (existingTrade) {
      throw new Error('Já existe uma troca pendente para este item.');
    }

    const trade = await Trade.create({
      sender_id,
      receiver_id,
      item_id,
      status: 'pending'
    });

    // Retorna com detalhes
    return this._getTradeWithDetails(trade.id);
  }

  async getUserTrades(userId) {
    const trades = await Trade.findAll({
      where: {
        [Op.or]: [
          { sender_id: userId },
          { receiver_id: userId }
        ]
      },
      include: this._includes(),
      order: [['created_at', 'DESC']]
    });

    return trades;
  }

  async acceptTrade(tradeId, userId) {
    const trade = await Trade.findByPk(tradeId);

    if (!trade) throw new Error('Troca não encontrada.');
    if (Number(trade.receiver_id) !== Number(userId)) {
      throw new Error('Apenas o destinatário pode aceitar a troca.');
    }
    if (trade.status !== 'pending') {
      throw new Error(`Não é possível aceitar uma troca com status "${trade.status}".`);
    }

    await trade.update({ status: 'accepted' });
    return this._getTradeWithDetails(trade.id);
  }

  async rejectTrade(tradeId, userId) {
    const trade = await Trade.findByPk(tradeId);

    if (!trade) throw new Error('Troca não encontrada.');
    if (Number(trade.receiver_id) !== Number(userId)) {
      throw new Error('Apenas o destinatário pode rejeitar a troca.');
    }
    if (trade.status !== 'pending') {
      throw new Error(`Não é possível rejeitar uma troca com status "${trade.status}".`);
    }

    await trade.update({ status: 'rejected' });
    return this._getTradeWithDetails(trade.id);
  }

  async cancelTrade(tradeId, userId) {
    const trade = await Trade.findByPk(tradeId);

    if (!trade) throw new Error('Troca não encontrada.');
    if (Number(trade.sender_id) !== Number(userId)) {
      throw new Error('Apenas o remetente pode cancelar a troca.');
    }
    if (trade.status !== 'pending') {
      throw new Error(`Não é possível cancelar uma troca com status "${trade.status}".`);
    }

    await trade.update({ status: 'canceled' });
    return this._getTradeWithDetails(trade.id);
  }

  // Busca uma troca com todos os detalhes
  async _getTradeWithDetails(tradeId) {
    return Trade.findByPk(tradeId, {
      include: this._includes()
    });
  }

  // Define os includes padrão
_includes() {
    return [
      {
        model: User,
        as: 'sender',
        attributes: ['id', 'nome', 'email']
      },
      {
        model: User,
        as: 'receiver',
        attributes: ['id', 'nome', 'email']
      },
      {
        model: Item,
        as: 'item',
        attributes: ['id', 'name', 'description']
      }
    ];
  }
}

module.exports = new TradeService();