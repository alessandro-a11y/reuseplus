const express = require('express');
const path = require('path');
const app = express();

// Configura EJS como template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Arquivos estáticos (CSS, JS, imagens)
app.use(express.static(path.join(__dirname, 'public')));

// Leitura de formulários
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ─── Rotas ───────────────────────────────────────────

// Redireciona a raiz para login
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Tela de login
app.get('/login', (req, res) => {
  res.render('auth/login', { erro: null });
});

// Tela de cadastro
app.get('/cadastro', (req, res) => {
  res.render('auth/register', { erro: null });
});

// Dashboard
app.get('/dashboard', (req, res) => {
  res.render('dashboard/index', { usuario: { nome: 'Davi' } });
});

// ─────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Frontend rodando em http://localhost:${PORT}`);
});