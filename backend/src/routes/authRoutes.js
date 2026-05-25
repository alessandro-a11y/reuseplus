const express = require('express');
const router = express.Router();
const { cadastrar, entrar } = require('../controllers/authController');

router.post('/register', cadastrar);
router.post('/login', entrar);

module.exports = router;