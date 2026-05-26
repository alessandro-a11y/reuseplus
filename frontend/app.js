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

// Middlewares
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

// ── Rota Raiz ──
app.get('/', (req, res) => {
  res.redirect('/login');
});

// ── Rotas de Autenticação ──

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
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('errors/500');
});

// Inicialização do Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});

module.exports = app;