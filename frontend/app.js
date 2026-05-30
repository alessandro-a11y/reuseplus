const express = require('express');
const path = require('path');
const axios = require('axios');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

<<<<<<< Updated upstream
const BACKEND_URL = 'http://localhost:3001/api';

// Configurações do View Engine (EJS)
=======
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
// Renderizar página de Login
app.get('/login', (req, res) => {
  res.render('auth/login', { erro: null });
});

// POST login — chama API do backend
app.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const resposta = await axios.post(`${BACKEND_URL}/auth/login`, { email, senha });
    const { token, user } = resposta.data;

    res.cookie('token', token, { httpOnly: true });
    res.cookie('usuario_nome', user.nome);

    res.redirect('/dashboard');
  } catch (err) {
    const mensagem = err.response?.data?.message || 'E-mail ou senha inválidos.';
    res.render('auth/login', { erro: mensagem });
  }
});

// Renderizar página de Cadastro
app.get('/register', (req, res) => {
  res.render('auth/register', { erro: null });
});

// POST cadastro — chama API do backend
app.post('/register', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    await axios.post(`${BACKEND_URL}/auth/register`, { nome, email, senha });
    res.redirect('/login');
  } catch (err) {
    const mensagem = err.response?.data?.message || 'Erro ao criar conta. Tente novamente.';
    res.render('auth/register', { erro: mensagem });
  }
});

// ── Outras Rotas do Sistema ──

app.get('/dashboard', autenticar, (req, res) => {
  const nome = req.cookies.usuario_nome || 'Usuário';
  res.render('dashboard/index', { usuario: { nome } });
});

app.get('/profile', autenticar, (req, res) => {
  const nome = req.cookies.usuario_nome || 'Usuário';
  res.render('profile/profile', { usuario: { nome, email: '' } });
});

app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.clearCookie('usuario_nome');
  res.redirect('/login');
});

// ── Tratamento de Erros ──

// 404 - Página Não Encontrada
app.use((req, res) => {
  res.status(404).render('errors/404');
});

// 500 - Erro Interno do Servidor
=======
app.use((req, res) => res.status(404).render('errors/404'));
>>>>>>> Stashed changes
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('errors/500');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);

module.exports = app;