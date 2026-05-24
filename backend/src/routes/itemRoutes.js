const express = require('express');
const router = express.Router();
const { create, list, getById, listByUser, update, deleteItem } = require('../controllers/itemController');
const { autenticar } = require('../middlewares/authMiddleware');

router.post('/', autenticar, create);
router.get('/', autenticar, list);
router.get('/meus', autenticar, listByUser);
router.get('/:id', autenticar, getById);
router.put('/:id', autenticar, update);
router.delete('/:id', autenticar, deleteItem);

module.exports = router;