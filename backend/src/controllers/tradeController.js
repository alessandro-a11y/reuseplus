const Trade = require('../models/trade');
const Item = require('../models/item');
const User = require('../models/user');

const includeCompleto = [
  { model: User, as: 'solicitante', attributes: ['id', 'nome', 'email'] },
  { model: User, as: 'receptor', attributes: ['id', 'nome', 'email'] },
  { model: Item, as: 'itemOferecido', attributes: ['id', 'titulo', 'imagem_url'] },
  { model: Item, as: 'itemDesejado', attributes: ['id', 'titulo', 'imagem_url'] }
];

const listar = async (req, res) => {
  try {
    const { Op } = require('sequelize');
    const trades = await Trade.findAll({
      where: {
        [Op.or]: [
          { solicitante_id: req.user.id },
          { receptor_id: req.user.id }
        ]
      },
      include: includeCompleto,
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(trades);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

const buscarPorId = async (req, res) => {
  try {
    const trade = await Trade.findByPk(req.params.id, { include: includeCompleto });
    if (!trade) return res.status(404).json({ erro: 'Troca não encontrada' });
    if (trade.solicitante_id !== req.user.id && trade.receptor_id !== req.user.id)
      return res.status(403).json({ erro: 'Sem permissão' });
    res.status(200).json(trade);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

const solicitar = async (req, res) => {
  try {
    const { item_oferecido_id, item_desejado_id, mensagem } = req.body;
    if (!item_oferecido_id || !item_desejado_id)
      return res.status(400).json({ erro: 'Informe os itens da troca' });

    const itemDesejado = await Item.findByPk(item_desejado_id);
    if (!itemDesejado) return res.status(404).json({ erro: 'Item desejado não encontrado' });
    if (!itemDesejado.disponivel)
      return res.status(400).json({ erro: 'Item não está disponível para troca' });

    const itemOferecido = await Item.findByPk(item_oferecido_id);
    if (!itemOferecido || itemOferecido.usuario_id !== req.user.id)
      return res.status(403).json({ erro: 'Você não possui este item' });

    const trade = await Trade.create({
      solicitante_id: req.user.id,
      receptor_id: itemDesejado.usuario_id,
      item_oferecido_id,
      item_desejado_id,
      mensagem
    });
    res.status(201).json(trade);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

const responder = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['aceita', 'recusada'].includes(status))
      return res.status(400).json({ erro: 'Status inválido' });

    const trade = await Trade.findByPk(req.params.id);
    if (!trade) return res.status(404).json({ erro: 'Troca não encontrada' });
    if (trade.receptor_id !== req.user.id)
      return res.status(403).json({ erro: 'Sem permissão para responder esta troca' });

    await trade.update({ status });

    if (status === 'aceita') {
      await Item.update({ disponivel: false }, { where: { id: trade.item_oferecido_id } });
      await Item.update({ disponivel: false }, { where: { id: trade.item_desejado_id } });
    }

    res.status(200).json(trade);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

module.exports = { listar, buscarPorId, solicitar, responder };