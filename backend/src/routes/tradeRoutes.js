const { Router } = require('express');
const TradeController = require('../controllers/TradeController');
const { autenticar } = require('../middlewares/authMiddleware');

const tradeRoutes = Router();

tradeRoutes.post('/trades', autenticar, TradeController.store);
tradeRoutes.get('/trades/history', autenticar, TradeController.index);
tradeRoutes.patch('/trades/:id/accept', autenticar, TradeController.accept);
tradeRoutes.patch('/trades/:id/reject', autenticar, TradeController.reject);
tradeRoutes.patch('/trades/:id/cancel', autenticar, TradeController.cancel);

module.exports = tradeRoutes;