const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const register = async (nome, email, senha) => {
  const userExiste = await User.findOne({ where: { email } });
  if (userExiste) throw new Error('Email já cadastrado');

  const senhaHash = await bcrypt.hash(senha, 10);
  const user = await User.create({ nome, email, senha: senhaHash });

  return { id: user.id, nome: user.nome, email: user.email };
};

const login = async (email, senha) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('Usuário não encontrado');

  const senhaValida = await bcrypt.compare(senha, user.senha);
  if (!senhaValida) throw new Error('Senha incorreta');

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { token, user: { id: user.id, nome: user.nome, email: user.email } };
};

module.exports = { register, login };