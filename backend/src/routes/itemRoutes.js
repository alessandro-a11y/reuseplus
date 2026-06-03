const express = require('express');
const router  = express.Router();
const { listar, meus, explorar, buscarPorId, criar, atualizar, deletar } = require('../controllers/itemController');
const { autenticar } = require('../middlewares/authMiddleware');

router.get('/',        autenticar, listar);
router.get('/meus',   autenticar, meus);
router.get('/explorar', autenticar, explorar);  // deve vir ANTES de /:id
router.get('/:id',    autenticar, buscarPorId);
router.post('/',      autenticar, criar);
router.put('/:id',    autenticar, atualizar);
router.delete('/:id', autenticar, deletar);

module.exports = router;