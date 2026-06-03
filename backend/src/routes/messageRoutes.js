'use strict';

const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/messageController');
const { autenticar } = require('../middlewares/authMiddleware');

router.get('/',                   autenticar, ctrl.listarConversas);
router.get('/trades',             autenticar, ctrl.listarTrades);
router.get('/count/nao-lidas',    autenticar, ctrl.contarNaoLidas);
router.get('/:tradeId',           autenticar, ctrl.listarMensagens);
router.post('/:tradeId',          autenticar, ctrl.enviarMensagem);

module.exports = router;