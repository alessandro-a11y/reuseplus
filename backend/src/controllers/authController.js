const { register, login } = require('../services/authService');

const cadastrar = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Preencha todos os campos' });
    }

    const user = await register(nome, email, senha);
    return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso', user });

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

module.exports = { cadastrar, entrar };