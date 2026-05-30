const express = require('express');
const router = express.Router();
const { listar, buscarPorId, solicitar, responder } = require('../controllers/tradeController');
const { autenticar } = require('../middlewares/authMiddleware');

router.get('/', autenticar, listar);
router.get('/:id', autenticar, buscarPorId);
router.post('/', autenticar, solicitar);
router.patch('/:id/responder', autenticar, responder);

module.exports = router;