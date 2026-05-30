const express = require('express');
const router = express.Router();
const { cadastrar, entrar, me, listar, atualizar, deletar } = require('../controllers/authController');
const { autenticar } = require('../middlewares/authMiddleware');

router.post('/register', cadastrar);
router.post('/login', entrar);
router.get('/me', autenticar, me);
router.get('/users', autenticar, listar);
router.put('/users/me', autenticar, atualizar);
router.delete('/users/me', autenticar, deletar);

module.exports = router;