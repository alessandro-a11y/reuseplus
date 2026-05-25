const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
<<<<<<< HEAD
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
=======
require('dotenv').config();

>>>>>>> 544cd7d (feat: integração JWT, model Item atualizado, rotas testadas e regras de negócio validadas)
const tradeRoutes = require('./routes/tradeRoutes');
const authRoutes = require('./routes/authRoutes');
require('./database');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api', tradeRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', mensagem: 'ReUse+ API funcionando' });
});

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

module.exports = app;
