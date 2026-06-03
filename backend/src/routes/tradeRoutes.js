const express = require('express');
const router  = express.Router();
const { listar, buscarPorId, solicitar, responder, concluir } = require('../controllers/tradeController');
const { autenticar } = require('../middlewares/authMiddleware');

router.get('/',                 autenticar, listar);
router.get('/:id',              autenticar, buscarPorId);
router.post('/',                autenticar, solicitar);
router.patch('/:id/responder',  autenticar, responder);
router.patch('/:id/concluir',   autenticar, concluir);   // nova rota

module.exports = router;