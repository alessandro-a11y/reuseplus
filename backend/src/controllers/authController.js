const bcrypt = require('bcryptjs');
const { register, login } = require('../services/authService');
const User = require('../models/user');

// POST /api/auth/register
const cadastrar = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha)
      return res.status(400).json({ erro: 'Preencha todos os campos' });
    const user = await register(nome, email, senha);
    return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso', user });
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
};

// POST /api/auth/login
const entrar = async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha)
      return res.status(400).json({ erro: 'Preencha todos os campos' });
    const dados = await login(email, senha);
    return res.status(200).json(dados);
  } catch (error) {
    return res.status(401).json({ erro: error.message });
  }
};

// GET /api/auth/me
const me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'nome', 'email', 'createdAt']
    });
    if (!user) return res.status(404).json({ erro: 'Usuário não encontrado' });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

// GET /api/auth/users — lista pública sem email
const listar = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'nome', 'createdAt']
    });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

// GET /api/auth/users/:id — perfil público de um usuário específico
const buscarPorId = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'nome', 'createdAt']
    });
    if (!user) return res.status(404).json({ erro: 'Usuário não encontrado' });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

// PUT /api/auth/users/me
const atualizar = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ erro: 'Usuário não encontrado' });

    const { nome, email, senha } = req.body;

    if (nome)  user.nome  = nome.trim();
    if (email) user.email = email.trim();

    if (senha && senha.trim()) {
      if (senha.trim().length < 6)
        return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres' });
      user.senha = await bcrypt.hash(senha.trim(), 10);
    }

    await user.save();

    const dadosAtualizados = { id: user.id, nome: user.nome, email: user.email };

    res.cookie('usuario', JSON.stringify(dadosAtualizados), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json(dadosAtualizados);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError')
      return res.status(400).json({ erro: 'Este e-mail já está em uso' });
    return res.status(500).json({ erro: error.message });
  }
};

// DELETE /api/auth/users/me
const deletar = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ erro: 'Usuário não encontrado' });
    await user.destroy();
    return res.status(200).json({ mensagem: 'Conta deletada com sucesso' });
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError')
      return res.status(400).json({ erro: 'Não é possível deletar conta com trocas ativas' });
    return res.status(500).json({ erro: error.message });
  }
};

module.exports = { cadastrar, entrar, me, listar, buscarPorId, atualizar, deletar };