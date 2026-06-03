'use strict';

const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/favoriteController');
const { autenticar } = require('../middlewares/authMiddleware');

// GET    /api/favorites              → lista favoritos do usuário
router.get('/',                   autenticar, ctrl.listar);

// GET    /api/favorites/check/:itemId → verifica se item é favorito
router.get('/check/:itemId',      autenticar, ctrl.verificar);

// POST   /api/favorites/:itemId     → adiciona aos favoritos
router.post('/:itemId',           autenticar, ctrl.adicionar);

// DELETE /api/favorites/:itemId     → remove dos favoritos
router.delete('/:itemId',         autenticar, ctrl.remover);

module.exports = router;
