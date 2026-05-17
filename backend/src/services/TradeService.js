const { Op } = require('sequelize');
const Trade = require('../models/Trade');

class TradeService {

  // Criar uma nova solicitação de troca
  async createTrade({ sender_id, receiver_id, item_id }) {

    // Regra: não pode trocar consigo mesmo
    if (Number(sender_id) === Number(receiver_id)) {
      throw new Error('Você não pode propor uma troca para si mesmo.');
    }

    // Regra: não pode ter uma troca pendente com o mesmo item
    const existingTrade = await Trade.findOne({
      where: {
        item_id,
        sender_id,
        status: 'pending'
      }
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

    return trade;
  }

  // Listar histórico de trocas do usuário
  async getUserTrades(userId) {
    const trades = await Trade.findAll({
      where: {
        [Op.or]: [
          { sender_id: userId },
          { receiver_id: userId }
        ]
      },
      order: [['created_at', 'DESC']]
    });

    return trades;
  }

  // Aceitar uma troca
  async acceptTrade(tradeId, userId) {
    const trade = await Trade.findByPk(tradeId);

    if (!trade) {
      throw new Error('Troca não encontrada.');
    }

    // Regra: só o destinatário pode aceitar
    if (Number(trade.receiver_id) !== Number(userId)) {
      throw new Error('Apenas o destinatário pode aceitar a troca.');
    }

    // Regra: só pode aceitar se estiver pendente
    if (trade.status !== 'pending') {
      throw new Error(`Não é possível aceitar uma troca com status "${trade.status}".`);
    }

    await trade.update({ status: 'accepted' });
    return trade;
  }

  // Rejeitar uma troca
  async rejectTrade(tradeId, userId) {
    const trade = await Trade.findByPk(tradeId);

    if (!trade) {
      throw new Error('Troca não encontrada.');
    }

    // Regra: só o destinatário pode rejeitar
    if (Number(trade.receiver_id) !== Number(userId)) {
      throw new Error('Apenas o destinatário pode rejeitar a troca.');
    }

    if (trade.status !== 'pending') {
      throw new Error(`Não é possível rejeitar uma troca com status "${trade.status}".`);
    }

    await trade.update({ status: 'rejected' });
    return trade;
  }

  // Cancelar uma troca
  async cancelTrade(tradeId, userId) {
    const trade = await Trade.findByPk(tradeId);

    if (!trade) {
      throw new Error('Troca não encontrada.');
    }

    // Regra: só o remetente pode cancelar
    if (Number(trade.sender_id) !== Number(userId)) {
      throw new Error('Apenas o remetente pode cancelar a troca.');
    }

    if (trade.status !== 'pending') {
      throw new Error(`Não é possível cancelar uma troca com status "${trade.status}".`);
    }

    await trade.update({ status: 'canceled' });
    return trade;
  }
}

module.exports = new TradeService();