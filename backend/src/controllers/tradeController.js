const { Op } = require('sequelize');
const Trade = require('../models/trade');
const Item  = require('../models/item');
const User  = require('../models/user');

const includeCompleto = [
  { model: User, as: 'solicitante',   attributes: ['id', 'nome', 'email'] },
  { model: User, as: 'receptor',      attributes: ['id', 'nome', 'email'] },
  { model: Item, as: 'itemOferecido', attributes: ['id', 'titulo', 'imagem_url'] },
  { model: Item, as: 'itemDesejado',  attributes: ['id', 'titulo', 'imagem_url'] }
];

// GET /api/trades — todas as trocas do usuário (solicitou ou recebeu)
const listar = async (req, res) => {
  try {
    const trades = await Trade.findAll({
      where: {
        [Op.or]: [
          { solicitante_id: req.user.id },
          { receptor_id:    req.user.id }
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

// GET /api/trades/:id
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

// POST /api/trades — solicitar troca
const solicitar = async (req, res) => {
  try {
    const { item_oferecido_id, item_desejado_id, mensagem } = req.body;
    if (!item_oferecido_id || !item_desejado_id)
      return res.status(400).json({ erro: 'Informe os itens da troca' });

    const itemDesejado = await Item.findByPk(item_desejado_id);
    if (!itemDesejado)
      return res.status(404).json({ erro: 'Item desejado não encontrado' });
    if (!itemDesejado.disponivel)
      return res.status(400).json({ erro: 'Item não está disponível para troca' });
    if (itemDesejado.usuario_id === req.user.id)
      return res.status(400).json({ erro: 'Você não pode solicitar troca com seu próprio item' });

    const itemOferecido = await Item.findByPk(item_oferecido_id);
    if (!itemOferecido || itemOferecido.usuario_id !== req.user.id)
      return res.status(403).json({ erro: 'Você não possui este item' });
    if (!itemOferecido.disponivel)
      return res.status(400).json({ erro: 'Seu item não está disponível para troca' });

    const trade = await Trade.create({
      solicitante_id:   req.user.id,
      receptor_id:      itemDesejado.usuario_id,
      item_oferecido_id,
      item_desejado_id,
      mensagem
    });

    const tradeCompleta = await Trade.findByPk(trade.id, { include: includeCompleto });
    res.status(201).json(tradeCompleta);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// PATCH /api/trades/:id/responder — aceitar ou recusar (só o receptor)
const responder = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['aceita', 'recusada'].includes(status))
      return res.status(400).json({ erro: 'Status inválido. Use "aceita" ou "recusada"' });

    const trade = await Trade.findByPk(req.params.id);
    if (!trade)
      return res.status(404).json({ erro: 'Troca não encontrada' });
    if (trade.receptor_id !== req.user.id)
      return res.status(403).json({ erro: 'Sem permissão para responder esta troca' });
    if (trade.status !== 'pendente')
      return res.status(400).json({ erro: 'Esta troca já foi respondida' });

    await trade.update({ status });

    if (status === 'aceita') {
      await Item.update(
        { disponivel: false, status_item: 'negociacao' },
        { where: { id: trade.item_oferecido_id } }
      );
      await Item.update(
        { disponivel: false, status_item: 'negociacao' },
        { where: { id: trade.item_desejado_id } }
      );
    }

    const tradeAtualizada = await Trade.findByPk(trade.id, { include: includeCompleto });
    res.status(200).json(tradeAtualizada);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// PATCH /api/trades/:id/concluir — confirmação dupla + transferência de propriedade
const concluir = async (req, res) => {
  try {
    const trade = await Trade.findByPk(req.params.id);
    if (!trade)
      return res.status(404).json({ erro: 'Troca não encontrada' });

    const ehSolicitante = trade.solicitante_id === req.user.id;
    const ehReceptor    = trade.receptor_id    === req.user.id;

    if (!ehSolicitante && !ehReceptor)
      return res.status(403).json({ erro: 'Sem permissão' });
    if (trade.status !== 'aceita')
      return res.status(400).json({ erro: 'Só é possível concluir trocas aceitas' });

    let confirmado_solicitante = trade.confirmado_solicitante || false;
    let confirmado_receptor    = trade.confirmado_receptor    || false;

    if (ehSolicitante) {
      if (confirmado_solicitante)
        return res.status(400).json({ erro: 'Você já confirmou esta troca. Aguardando a outra parte.' });
      confirmado_solicitante = true;
    }

    if (ehReceptor) {
      if (confirmado_receptor)
        return res.status(400).json({ erro: 'Você já confirmou esta troca. Aguardando a outra parte.' });
      confirmado_receptor = true;
    }

    await trade.update({ confirmado_solicitante, confirmado_receptor });

    // Só conclui quando os dois confirmaram
    if (confirmado_solicitante && confirmado_receptor) {
      await trade.update({ status: 'concluida' });

      // ✅ Transfere propriedade dos itens entre os usuários
      // itemOferecido era do solicitante → vai para o receptor
      await Item.update(
        {
          usuario_id:  trade.receptor_id,
          disponivel:  true,
          status_item: 'disponivel'
        },
        { where: { id: trade.item_oferecido_id } }
      );

      // itemDesejado era do receptor → vai para o solicitante
      await Item.update(
        {
          usuario_id:  trade.solicitante_id,
          disponivel:  true,
          status_item: 'disponivel'
        },
        { where: { id: trade.item_desejado_id } }
      );

      const tradeAtualizada = await Trade.findByPk(trade.id, { include: includeCompleto });
      return res.status(200).json({ ...tradeAtualizada.toJSON(), concluida: true });
    }

    // Um confirmou, aguarda o outro
    const tradeAtualizada = await Trade.findByPk(trade.id, { include: includeCompleto });
    return res.status(200).json({
      ...tradeAtualizada.toJSON(),
      concluida: false,
      mensagem: 'Sua confirmação foi registrada. Aguardando confirmação da outra parte.'
    });

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

module.exports = { listar, buscarPorId, solicitar, responder, concluir };