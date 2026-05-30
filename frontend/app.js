const express = require('express');
const path = require('path');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000/api';

// ── View Engine ──────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// ── Middleware: protege rotas privadas ────────────────────────
const autenticar = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.redirect('/login?sessao=expirada');
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.clearCookie('token');
    res.clearCookie('usuario');
    return res.redirect('/login?sessao=expirada');
  }
};

// ── Helper: lê usuário do cookie ─────────────────────────────
const getUsuario = (req) => {
  try {
    return req.cookies.usuario
      ? JSON.parse(req.cookies.usuario)
      : { nome: 'Usuário', email: '' };
  } catch {
    return { nome: 'Usuário', email: '' };
  }
};

// ── Rotas públicas ────────────────────────────────────────────
app.get('/', (req, res) => {
  if (req.cookies.token) return res.redirect('/dashboard');
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  if (req.cookies.token) return res.redirect('/dashboard');
  const erro = req.query.sessao === 'expirada'
    ? 'Sessão expirada. Faça login novamente.'
    : null;
  res.render('auth/login', { erro });
});

app.get('/register', (req, res) => {
  if (req.cookies.token) return res.redirect('/dashboard');
  res.render('auth/register', { erro: null });
});

// ── POST Login ────────────────────────────────────────────────
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const { data } = await axios.post(`${BACKEND_URL}/auth/login`, { email, senha });

    const cookieOpts = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    };

    res.cookie('token', data.token, cookieOpts);
    res.cookie('usuario', JSON.stringify(data.user), {
      ...cookieOpts,
      httpOnly: false // legível pelo EJS via req.cookies
    });

    res.redirect('/dashboard');
  } catch (err) {
    const msg = err.response?.data?.erro || 'E-mail ou senha incorretos.';
    res.render('auth/login', { erro: msg });
  }
});

// ── POST Cadastro ─────────────────────────────────────────────
app.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    await axios.post(`${BACKEND_URL}/auth/register`, { nome, email, senha });

    // Login automático após cadastro
    const { data } = await axios.post(`${BACKEND_URL}/auth/login`, { email, senha });

    const cookieOpts = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    };

    res.cookie('token', data.token, cookieOpts);
    res.cookie('usuario', JSON.stringify(data.user), {
      ...cookieOpts,
      httpOnly: false
    });

    res.redirect('/dashboard');
  } catch (err) {
    const msg = err.response?.data?.erro || 'Erro ao cadastrar. Tente novamente.';
    res.render('auth/register', { erro: msg });
  }
});

// ── Logout ────────────────────────────────────────────────────
app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.clearCookie('usuario');
  res.redirect('/login');
});

// ── Rotas privadas ────────────────────────────────────────────
app.get('/dashboard', autenticar, (req, res) =>
  res.render('dashboard/index', { usuario: getUsuario(req), page: 'dashboard' }));

app.get('/items', autenticar, (req, res) =>
  res.render('items/list', { usuario: getUsuario(req), page: 'items' }));

app.get('/items/create', autenticar, (req, res) =>
  res.render('items/create', { usuario: getUsuario(req), page: 'items' }));

app.get('/items/:id/edit', autenticar, (req, res) =>
  res.render('items/edit', { usuario: getUsuario(req), page: 'items' }));

app.get('/items/:id', autenticar, (req, res) =>
  res.render('items/details', { usuario: getUsuario(req), page: 'items' }));

app.get('/trades', autenticar, (req, res) =>
  res.render('trades/list', { usuario: getUsuario(req), page: 'trades' }));

app.get('/trades/history', autenticar, (req, res) =>
  res.render('trades/history', { usuario: getUsuario(req), page: 'trades' }));

app.get('/trades/request', autenticar, (req, res) =>
  res.render('trades/request', { usuario: getUsuario(req), page: 'trades' }));

app.get('/favorites', autenticar, (req, res) =>
  res.render('favorites/index', { usuario: getUsuario(req), page: 'favorites' }));

app.get('/messages', autenticar, (req, res) =>
  res.render('messages/index', { usuario: getUsuario(req), page: 'messages' }));

app.get('/ratings', autenticar, (req, res) =>
  res.render('ratings/index', { usuario: getUsuario(req), page: 'ratings' }));

app.get('/impact', autenticar, (req, res) =>
  res.render('impact/index', { usuario: getUsuario(req), page: 'impact' }));

app.get('/profile', autenticar, (req, res) =>
  res.render('profile/profile', { usuario: getUsuario(req), page: 'profile' }));

app.get('/settings', autenticar, (req, res) =>
  res.render('settings/index', { usuario: getUsuario(req), page: 'settings' }));

// ── Erros ─────────────────────────────────────────────────────
app.use((req, res) => res.status(404).render('errors/404'));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('errors/500');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Frontend rodando em http://localhost:${PORT}`));

module.exports = app;