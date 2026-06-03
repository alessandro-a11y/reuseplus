const express = require('express');
const router  = express.Router();
const { autenticar } = require('../middlewares/authMiddleware');
const Trade = require('../models/trade');
const Item  = require('../models/item');

// GET /api/notifications/count
// Retorna quantas trocas pendentes o usuário recebeu (é o receptor)
router.get('/count', autenticar, async (req, res) => {
  try {
    const count = await Trade.count({
      where: {
        receptor_id: req.user.id,
        status: 'pendente'
      }
    });
    res.json({ count });
  } catch (err) {
    console.error('Erro ao contar notificações:', err);
    res.status(500).json({ erro: 'Erro interno', count: 0 });
  }
});

module.exports = router;