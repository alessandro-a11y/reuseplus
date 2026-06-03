const { Op } = require('sequelize');
const Item    = require('../models/item');
const User    = require('../models/user');
const Trade   = require('../models/trade');
const Message = require('../models/message'); // ← ADICIONAR

// GET /api/items — todos os itens disponíveis (qualquer usuário)
const listar = async (req, res) => {
  try {
    const items = await Item.findAll({
      where: { disponivel: true },
      include: [{ model: User, as: 'dono', attributes: ['id', 'nome'] }],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// GET /api/items/meus — apenas os itens do usuário logado
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

// GET /api/items/explorar — itens disponíveis de OUTROS usuários, com filtros
const explorar = async (req, res) => {
  try {
    const { categoria, estado } = req.query;

    const where = {
      usuario_id: { [Op.ne]: req.user.id },
      disponivel: true
    };

    if (categoria) where.categoria = categoria;
    if (estado)    where.estado    = estado;

    const items = await Item.findAll({
      where,
      include: [{ model: User, as: 'dono', attributes: ['id', 'nome'] }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// GET /api/items/:id
const buscarPorId = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id, {
      include: [{ model: User, as: 'dono', attributes: ['id', 'nome'] }]
    });
    if (!item) return res.status(404).json({ erro: 'Item não encontrado' });
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// POST /api/items
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

// PUT /api/items/:id
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

// DELETE /api/items/:id
// ✅ CORRIGIDO: deleta mensagens → trades → item (respeitando ordem das FKs)
const deletar = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ erro: 'Item não encontrado' });
    if (item.usuario_id !== req.user.id)
      return res.status(403).json({ erro: 'Sem permissão para deletar este item' });

    // Bloqueia exclusão se item está em troca aceita (em andamento)
    const tradeAtiva = await Trade.findOne({
      where: {
        status: 'aceita',
        [Op.or]: [
          { item_oferecido_id: item.id },
          { item_desejado_id:  item.id }
        ]
      }
    });

    if (tradeAtiva) {
      return res.status(400).json({
        erro: 'Este item está em uma troca aceita e não pode ser excluído. Conclua ou cancele a troca primeiro.'
      });
    }

    // Busca todas as trades vinculadas ao item
    const trades = await Trade.findAll({
      where: {
        [Op.or]: [
          { item_oferecido_id: item.id },
          { item_desejado_id:  item.id }
        ]
      }
    });

    // 1º: deleta mensagens vinculadas às trades
    if (trades.length > 0) {
      const tradeIds = trades.map(t => t.id);
      await Message.destroy({ where: { trade_id: { [Op.in]: tradeIds } } });
    }

    // 2º: deleta as trades
    await Trade.destroy({
      where: {
        [Op.or]: [
          { item_oferecido_id: item.id },
          { item_desejado_id:  item.id }
        ]
      }
    });

    // 3º: deleta o item
    await item.destroy();
    res.status(200).json({ mensagem: 'Item deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

module.exports = { listar, meus, explorar, buscarPorId, criar, atualizar, deletar };