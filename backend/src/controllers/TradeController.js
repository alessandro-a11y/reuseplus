const TradeService = require('../services/TradeService');

module.exports = {

  async store(req, res) {
    try {
      const { receiver_id, item_id } = req.body;
      const sender_id = req.user.id;

      const trade = await TradeService.createTrade({ sender_id, receiver_id, item_id });
      return res.status(201).json(trade);
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  },

  async index(req, res) {
    try {
      const userId = req.user.id;
      const trades = await TradeService.getUserTrades(userId);
      return res.json(trades);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },

  async accept(req, res) {
    try {
      const trade = await TradeService.acceptTrade(req.params.id, req.user.id);
      return res.json(trade);
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  },

  async reject(req, res) {
    try {
      const trade = await TradeService.rejectTrade(req.params.id, req.user.id);
      return res.json(trade);
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  },

  async cancel(req, res) {
    try {
      const trade = await TradeService.cancelTrade(req.params.id, req.user.id);
      return res.json(trade);
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }
};