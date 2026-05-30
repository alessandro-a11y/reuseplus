const express = require('express');
const path = require('path');
const axios = require('axios');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

const BACKEND_URL = 'http://localhost:3001/api';

// Configurações do View Engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Middleware que protege rotas privadas
const autenticar = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.redirect('/login');
  next();
};

const usuario = { nome: 'Usuario', email: 'usuario@email.com' };

app.get('/', (req, res) => res.redirect('/login'));
app.get('/login', (req, res) => res.render('auth/login', { erro: null }));
app.get('/cadastro', (req, res) => res.render('auth/register', { erro: null }));
app.get('/dashboard', (req, res) => res.render('dashboard/index', { usuario, page: 'dashboard' }));
app.get('/items', (req, res) => res.render('items/list', { usuario, page: 'items' }));
app.get('/items/create', (req, res) => res.render('items/create', { usuario, page: 'items' }));
app.get('/items/:id', (req, res) => res.render('items/details', { usuario, page: 'items' }));
app.get('/items/:id/edit', (req, res) => res.render('items/edit', { usuario, page: 'items' }));
app.get('/trades', (req, res) => res.render('trades/list', { usuario, page: 'trades' }));
app.get('/trades/history', (req, res) => res.render('trades/history', { usuario, page: 'trades' }));
app.get('/trades/request', (req, res) => res.render('trades/request', { usuario, page: 'trades' }));
app.get('/favorites', (req, res) => res.render('favorites/index', { usuario, page: 'favorites' }));
app.get('/messages', (req, res) => res.render('messages/index', { usuario, page: 'messages' }));
app.get('/ratings', (req, res) => res.render('ratings/index', { usuario, page: 'ratings' }));
app.get('/impact', (req, res) => res.render('impact/index', { usuario, page: 'impact' }));
app.get('/profile', (req, res) => res.render('profile/profile', { usuario, page: 'profile' }));
app.get('/settings', (req, res) => res.render('settings/index', { usuario, page: 'settings' }));
app.get('/logout', (req, res) => res.redirect('/login'));

app.use((req, res) => res.status(404).render('errors/404'));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('errors/500');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);

module.exports = app;