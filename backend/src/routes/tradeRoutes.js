const { Router } = require('express');
const TradeController = require('../controllers/TradeController');

const tradeRoutes = Router();

// Criar uma solicitação de troca
tradeRoutes.post('/trades', TradeController.store);

// Listar histórico de trocas do usuário
tradeRoutes.get('/trades/history', TradeController.index);

// Aceitar uma troca
tradeRoutes.patch('/trades/:id/accept', TradeController.accept);

// Rejeitar uma troca
tradeRoutes.patch('/trades/:id/reject', TradeController.reject);

// Cancelar uma troca
tradeRoutes.patch('/trades/:id/cancel', TradeController.cancel);

module.exports = tradeRoutes;