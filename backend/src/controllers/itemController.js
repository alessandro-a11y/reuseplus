const { Op } = require('sequelize');
const Item = require('../models/item.js');

// Criar item
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

// Listar todos os itens (com filtros opcionais por categoria e status)
const list = async (req, res) => {
  try {
    const { categoria, status } = req.query;
    const where = {};

    if (categoria) where.categoria = categoria;
    if (status) where.status = status;

    const items = await Item.findAll({ where });
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

// Buscar item por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findByPk(id);

    if (!item) return res.status(404).json({ erro: 'Item não encontrado' });

    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

// Listar itens do usuário autenticado
const listByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { categoria, status } = req.query;
    const where = { userId };

    if (categoria) where.categoria = categoria;
    if (status) where.status = status;

    const items = await Item.findAll({ where });
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

// Atualizar item
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descricao, categoria, status } = req.body;
    const item = await Item.findByPk(id);

    if (!item) return res.status(404).json({ erro: 'Item não encontrado' });

    if (item.userId !== req.user.id) {
      return res.status(403).json({ erro: 'Sem permissão para editar este item' });
    }

    await item.update({ titulo, descricao, categoria, status });
    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

// Deletar item
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findByPk(id);

    if (!item) return res.status(404).json({ erro: 'Item não encontrado' });

    if (item.userId !== req.user.id) {
      return res.status(403).json({ erro: 'Sem permissão para deletar este item' });
    }

    await item.destroy();
    return res.status(200).json({ mensagem: 'Item deletado com sucesso' });
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

module.exports = { create, list, getById, listByUser, update, deleteItem };