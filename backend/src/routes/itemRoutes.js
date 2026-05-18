const express = require('express');
const router = express.Router();
const { create, list, update, deleteItem } = require('../controllers/itemController');

router.post('/', create);
router.get('/', list);
router.put('/:id', update);
router.delete('/:id', deleteItem);

module.exports = router;