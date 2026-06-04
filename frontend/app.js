const express = require('express');
const path = require('path');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000/api';
const isProd = process.env.NODE_ENV === 'production';

// ── View Engine ──────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// ── Opções de cookie ──────────────────────────────────────────
// Em produção (HTTPS): secure + sameSite none para cross-site
// Em dev (HTTP):       sem secure, sameSite lax
const cookieOpts = isProd
  ? { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 }
  : { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 };

const cookieOptsPublic = { ...cookieOpts, httpOnly: false };

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

// ── Helper: chama o backend com token ────────────────────────
const api = (req) => {
  const token = req.cookies.token;
  return axios.create({
    baseURL: BACKEND_URL,
    headers: { Authorization: `Bearer ${token}` }
  });
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
    res.cookie('token',   data.token,                    cookieOpts);
    res.cookie('usuario', JSON.stringify(data.user),     cookieOptsPublic);
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
    const { data } = await axios.post(`${BACKEND_URL}/auth/login`, { email, senha });
    res.cookie('token',   data.token,                    cookieOpts);
    res.cookie('usuario', JSON.stringify(data.user),     cookieOptsPublic);
    res.redirect('/dashboard');
  } catch (err) {
    const msg = err.response?.data?.erro || 'Erro ao cadastrar. Tente novamente.';
    res.render('auth/register', { erro: msg });
  }
});

// ── Logout ────────────────────────────────────────────────────
app.get('/logout', (req, res) => {
  res.clearCookie('token',   { ...cookieOpts,       httpOnly: true  });
  res.clearCookie('usuario', { ...cookieOptsPublic, httpOnly: false });
  res.redirect('/login');
});

// ── Rotas de páginas ──────────────────────────────────────────
app.get('/dashboard', autenticar, (req, res) =>
  res.render('dashboard/index', { usuario: getUsuario(req), page: 'dashboard' }));

app.get('/items', autenticar, (req, res) =>
  res.render('items/list', { usuario: getUsuario(req), page: 'items' }));

app.get('/items/create', autenticar, (req, res) =>
  res.render('items/create', { usuario: getUsuario(req), page: 'items', erro: null }));

app.post('/items', autenticar, async (req, res) => {
  try {
    const { titulo, descricao, categoria, estado, imagem_url } = req.body;
    await api(req).post('/items', { titulo, descricao, categoria, estado, imagem_url });
    res.redirect('/items');
  } catch (err) {
    const msg = err.response?.data?.erro || 'Erro ao cadastrar item.';
    res.render('items/create', { usuario: getUsuario(req), page: 'items', erro: msg });
  }
});

app.get('/items/:id/edit', autenticar, async (req, res) => {
  try {
    const { data: item } = await api(req).get(`/items/${req.params.id}`);
    res.render('items/edit', { usuario: getUsuario(req), page: 'items', item, erro: null });
  } catch {
    res.redirect('/items');
  }
});

app.post('/items/:id/edit', autenticar, async (req, res) => {
  try {
    const { titulo, descricao, categoria, estado, imagem_url } = req.body;
    await api(req).put(`/items/${req.params.id}`, { titulo, descricao, categoria, estado, imagem_url });
    res.redirect('/items');
  } catch (err) {
    const msg = err.response?.data?.erro || 'Erro ao editar item.';
    const { data: item } = await api(req).get(`/items/${req.params.id}`).catch(() => ({ data: {} }));
    res.render('items/edit', { usuario: getUsuario(req), page: 'items', item, erro: msg });
  }
});

app.get('/items/:id', autenticar, async (req, res) => {
  try {
    const { data: item } = await api(req).get(`/items/${req.params.id}`);
    res.render('items/details', { usuario: getUsuario(req), page: 'items', item });
  } catch {
    res.redirect('/items');
  }
});

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

app.get('/explore', autenticar, (req, res) =>
  res.render('items/explore', { usuario: getUsuario(req), page: 'explore' }));

app.get('/users/:id', autenticar, async (req, res) => {
  try {
    const { data: dono } = await api(req).get(`/auth/users/${req.params.id}`);
    res.render('users/public', { usuario: getUsuario(req), dono, page: '' });
  } catch {
    res.redirect('/explore');
  }
});

// ── Proxy API ─────────────────────────────────────────────────
app.use('/api', autenticar, async (req, res) => {
  try {
    const { data } = await api(req)({
      method: req.method,
      url: req.path,
      data: req.body
    });
    res.json(data);
  } catch (err) {
    const status = err.response?.status || 500;
    const msg    = err.response?.data   || { erro: 'Erro interno' };
    res.status(status).json(msg);
  }
});

// ── Erros ─────────────────────────────────────────────────────
app.use((req, res) => res.status(404).render('errors/404'));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('errors/500');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Frontend rodando em http://localhost:${PORT}`));

module.exports = app;