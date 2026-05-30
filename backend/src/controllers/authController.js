const { register, login } = require('../services/authService');
const User = require('../models/user');

const cadastrar = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Preencha todos os campos' });
    }
    const user = await register(nome, email, senha);
    return res.status(201).json({ mensagem: 'Usuario cadastrado com sucesso', user });
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
};

const entrar = async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ erro: 'Preencha todos os campos' });
    }
    const dados = await login(email, senha);
    return res.status(200).json(dados);
  } catch (error) {
    return res.status(401).json({ erro: error.message });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'nome', 'email', 'createdAt']
    });
    if (!user) return res.status(404).json({ erro: 'Usuario nao encontrado' });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

const listar = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'nome', 'email', 'createdAt']
    });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

const atualizar = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ erro: 'Usuario nao encontrado' });
    const { nome, email } = req.body;
    await user.update({ nome, email });
    return res.status(200).json({ id: user.id, nome: user.nome, email: user.email });
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

const deletar = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ erro: 'Usuario nao encontrado' });
    await user.destroy();
    return res.status(200).json({ mensagem: 'Conta deletada com sucesso' });
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ erro: 'Nao e possivel deletar conta com trocas ativas' });
    }
    return res.status(500).json({ erro: error.message });
  }
};

module.exports = { cadastrar, entrar, me, listar, atualizar, deletar };