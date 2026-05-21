const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const itemRoutes = require('./routes/itemRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/items', itemRoutes);

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