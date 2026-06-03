'use strict';

const Favorite = require('../models/favorite');
const Item     = require('../models/item');
const User     = require('../models/user');

/* ══════════════════════════════════════════
   GET /api/favorites
   Lista todos os favoritos do usuário logado
   ══════════════════════════════════════════ */
exports.listar = async (req, res) => {
  try {
    const favoritos = await Favorite.findAll({
      where: { usuario_id: req.user.id },
      include: [
        {
          model: Item,
          as: 'item',
          include: [{ model: User, as: 'dono', attributes: ['id', 'nome'] }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Retorna direto os itens, mais fácil de usar no frontend
    const itens = favoritos
      .filter(f => f.item !== null) // item pode ter sido deletado
      .map(f => ({ ...f.item.toJSON(), favoritoId: f.id }));

    res.json(itens);
  } catch (err) {
    console.error('[favoriteController.listar]', err);
    res.status(500).json({ erro: 'Erro ao listar favoritos.' });
  }
};

/* ══════════════════════════════════════════
   POST /api/favorites/:itemId
   Adiciona item aos favoritos
   ══════════════════════════════════════════ */
exports.adicionar = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const itemId    = Number(req.params.itemId);

    // Verifica se o item existe
    const item = await Item.findByPk(itemId);
    if (!item) {
      return res.status(404).json({ erro: 'Item não encontrado.' });
    }

    // Não pode favoritar o próprio item
    if (item.usuario_id === usuarioId) {
      return res.status(400).json({ erro: 'Você não pode favoritar seu próprio item.' });
    }

    // findOrCreate evita duplicata sem precisar verificar antes
    const [favorito, criado] = await Favorite.findOrCreate({
      where: { usuario_id: usuarioId, item_id: itemId }
    });

    if (!criado) {
      return res.status(409).json({ erro: 'Item já está nos favoritos.', favoritoId: favorito.id });
    }

    res.status(201).json({ mensagem: 'Item adicionado aos favoritos.', favoritoId: favorito.id });
  } catch (err) {
    console.error('[favoriteController.adicionar]', err);
    res.status(500).json({ erro: 'Erro ao adicionar favorito.' });
  }
};

/* ══════════════════════════════════════════
   DELETE /api/favorites/:itemId
   Remove item dos favoritos
   ══════════════════════════════════════════ */
exports.remover = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const itemId    = Number(req.params.itemId);

    const favorito = await Favorite.findOne({
      where: { usuario_id: usuarioId, item_id: itemId }
    });

    if (!favorito) {
      return res.status(404).json({ erro: 'Favorito não encontrado.' });
    }

    await favorito.destroy();
    res.json({ mensagem: 'Item removido dos favoritos.' });
  } catch (err) {
    console.error('[favoriteController.remover]', err);
    res.status(500).json({ erro: 'Erro ao remover favorito.' });
  }
};

/* ══════════════════════════════════════════
   GET /api/favorites/check/:itemId
   Verifica se um item específico é favorito
   (usado para atualizar o botão de coração)
   ══════════════════════════════════════════ */
exports.verificar = async (req, res) => {
  try {
    const favorito = await Favorite.findOne({
      where: {
        usuario_id: req.user.id,
        item_id:    Number(req.params.itemId)
      }
    });

    res.json({ favoritado: !!favorito, favoritoId: favorito?.id || null });
  } catch (err) {
    console.error('[favoriteController.verificar]', err);
    res.status(500).json({ erro: 'Erro ao verificar favorito.' });
  }
};
