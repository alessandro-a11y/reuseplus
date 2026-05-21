const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('auth/login', { erro: null });
});

app.get('/cadastro', (req, res) => {
  res.render('auth/register', { erro: null });
});

app.get('/dashboard', (req, res) => {
  res.render('dashboard/index', { usuario: { nome: 'Usuario' } });
});

app.get('/profile', (req, res) => {
  res.render('profile/profile', { usuario: { nome: 'Usuario', email: 'usuario@email.com' } });
});

app.get('/logout', (req, res) => {
  res.redirect('/login');
});

app.use((req, res) => {
  res.status(404).render('errors/404');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('errors/500');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);

module.exports = app;