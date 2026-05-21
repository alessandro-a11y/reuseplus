const Item = require('../models/item');

const create = async (req, res) => {
  try {
    const { titulo, descricao, categoria, status } = req.body;
    const userId = req.user.id;
    const item = await Item.create({ titulo, descricao, categoria, status, userId });
    return res.status(201).json(item);
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

const list = async (req, res) => {
  try {
    const items = await Item.findAll();
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descricao, categoria, status } = req.body;
    const item = await Item.findByPk(id);

    if (!item) return res.status(404).json({ erro: 'Item não encontrado' });

    await item.update({ titulo, descricao, categoria, status });
    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findByPk(id);

    if (!item) return res.status(404).json({ erro: 'Item não encontrado' });

    await item.destroy();
    return res.status(200).json({ mensagem: 'Item deletado com sucesso' });
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

module.exports = { create, list, update, deleteItem };