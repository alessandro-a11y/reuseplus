const express = require('express');
const router  = express.Router();
const { criar, minhas, porUsuario, podeAvaliar } = require('../controllers/ratingController');
const { autenticar } = require('../middlewares/authMiddleware');

router.post('/',                        autenticar, criar);
router.get('/me',                       autenticar, minhas);
router.get('/usuario/:id',              autenticar, porUsuario);
router.get('/pode-avaliar/:trade_id',   autenticar, podeAvaliar);

module.exports = router;