const Item = require('../models/item');
const User = require('../models/user');

const listar = async (req, res) => {
  try {
    const items = await Item.findAll({
      where: { disponivel: true },
      include: [{ model: User, as: 'dono', attributes: ['id', 'nome', 'email'] }],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

const meus = async (req, res) => {
  try {
    const items = await Item.findAll({
      where: { usuario_id: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

const buscarPorId = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id, {
      include: [{ model: User, as: 'dono', attributes: ['id', 'nome', 'email'] }]
    });
    if (!item) return res.status(404).json({ erro: 'Item não encontrado' });
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

const criar = async (req, res) => {
  try {
    const { titulo, descricao, categoria, estado, imagem_url } = req.body;
    if (!titulo) return res.status(400).json({ erro: 'Título é obrigatório' });
    const item = await Item.create({
      titulo, descricao, categoria, estado, imagem_url,
      usuario_id: req.user.id
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

const atualizar = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ erro: 'Item não encontrado' });
    if (item.usuario_id !== req.user.id)
      return res.status(403).json({ erro: 'Sem permissão para editar este item' });
    const { titulo, descricao, categoria, estado, disponivel, imagem_url } = req.body;
    await item.update({ titulo, descricao, categoria, estado, disponivel, imagem_url });
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

const deletar = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ erro: 'Item não encontrado' });
    if (item.usuario_id !== req.user.id)
      return res.status(403).json({ erro: 'Sem permissão para deletar este item' });
    await item.destroy();
    res.status(200).json({ mensagem: 'Item deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

module.exports = { listar, meus, buscarPorId, criar, atualizar, deletar };