const express = require('express');
const router = express.Router();
const { cadastrar, entrar, me, listar, buscarPorId, atualizar, deletar } = require('../controllers/authController');
const { autenticar } = require('../middlewares/authMiddleware');

router.post('/register', cadastrar);
router.post('/login', entrar);
router.get('/me', autenticar, me);
router.get('/users', autenticar, listar);
router.put('/users/me', autenticar, atualizar);
router.delete('/users/me', autenticar, deletar);
router.get('/users/:id', autenticar, buscarPorId); // ← perfil público por ID

module.exports = router;