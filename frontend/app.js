const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

// Configurações do View Engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ── Rota Raiz ──
app.get('/', (req, res) => {
  res.redirect('/login');
});

// ── Rotas de Autenticação ──

// Renderizar página de Login
app.get('/login', (req, res) => {
  res.render('auth/login', { erro: null });
});

// Processar o formulário de Login
app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  
  // LOGICA: Insira aqui a validação de senha e busca no banco de dados futuramente.
  console.log(`Tentativa de login com o e-mail: ${email}`);
  
  // Simulando login com sucesso enviando para a dashboard
  res.redirect('/dashboard');
});

// Renderizar página de Cadastro
app.get('/register', (req, res) => {
  res.render('auth/register', { erro: null });
});

// Processar o formulário de Cadastro
app.post('/register', (req, res) => {
  const { nome, email, senha } = req.body;

  // LÓGICA: Insira aqui a criação do usuário no banco de dados futuramente.
  console.log(`Criando conta para: ${nome} (${email})`);

  // Cadastro realizado com sucesso, redireciona para o login
  res.redirect('/login');
});

// ── Outras Rotas do Sistema ──

app.get('/dashboard', (req, res) => {
  res.render('dashboard/index', { usuario: { nome: 'Usuário' } });
});

app.get('/profile', (req, res) => {
  res.render('profile/profile', { usuario: { nome: 'Usuário', email: 'usuario@email.com' } });
});

app.get('/logout', (req, res) => {
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