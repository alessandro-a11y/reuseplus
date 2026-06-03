'use strict';

const express      = require('express');
const http         = require('http');
const { Server }   = require('socket.io');
const cors         = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const app    = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL || 'http://localhost:3001', methods: ['GET', 'POST'], credentials: true }
});

app.set('io', io);

io.on('connection', (socket) => {
  socket.on('entrar_trade', (tradeId) => socket.join(`trade_${tradeId}`));
  socket.on('sair_trade',   (tradeId) => socket.leave(`trade_${tradeId}`));
});

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3001', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const authRoutes    = require('./routes/authRoutes');
const itemRoutes    = require('./routes/itemRoutes');
const tradeRoutes   = require('./routes/tradeRoutes');
const messageRoutes = require('./routes/messageRoutes');
const favoriteRoutes= require('./routes/favoriteRoutes');
const ratingRoutes  = require('./routes/ratingRoutes'); // ← NOVO

app.use('/api/auth',     authRoutes);
app.use('/api/items',    itemRoutes);
app.use('/api/trades',   tradeRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/favorites',favoriteRoutes);
app.use('/api/ratings',  ratingRoutes); // ← NOVO

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', mensagem: 'ReUse+ API funcionando' });
});

app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada' }));
app.use((err, req, res, next) => {
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

const sequelize  = require('./config/database');
const User       = require('./models/user');
const Item       = require('./models/item');
const Trade      = require('./models/trade');
const Message    = require('./models/message');
const Favorite   = require('./models/favorite');
const Rating     = require('./models/rating'); // ← NOVO

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => sequelize.sync({ alter: true })) // cria tabela ratings automaticamente
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(() => process.exit(1));