'use strict';

const { Op } = require('sequelize');

const Message = require('../models/message');
const Trade   = require('../models/trade');
const User    = require('../models/user');
const Item    = require('../models/item');

exports.listarConversas = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const trades = await Trade.findAll({
      where: {
        [Op.or]: [
          { solicitante_id: usuarioId },
          { receptor_id: usuarioId },
        ],
      },
      include: [
        { model: User, as: 'solicitante', attributes: ['id', 'nome', 'email'] },
        { model: User, as: 'receptor',    attributes: ['id', 'nome', 'email'] },
        { model: Item, as: 'itemOferecido', attributes: ['id', 'titulo', 'imagem_url'] },
        { model: Item, as: 'itemDesejado',  attributes: ['id', 'titulo', 'imagem_url'] },
      ],
    });

    const conversas = await Promise.all(
      trades.map(async (trade) => {
        const ultimaMensagem = await Message.findOne({
          where: { trade_id: trade.id },
          order: [['createdAt', 'DESC']],
          include: [{ model: User, as: 'remetente', attributes: ['id', 'nome'] }],
        });

        const naoLidas = await Message.count({
          where: {
            trade_id: trade.id,
            lida: false,
            remetente_id: { [Op.ne]: usuarioId },
          },
        });

        const outraParte =
          trade.solicitante_id === usuarioId ? trade.receptor : trade.solicitante;

        return { trade, outraParte, ultimaMensagem, naoLidas };
      })
    );

    const comMensagens = conversas
      .filter((c) => c.ultimaMensagem !== null)
      .sort((a, b) =>
        new Date(b.ultimaMensagem.createdAt) - new Date(a.ultimaMensagem.createdAt)
      );

    res.json(comMensagens);
  } catch (err) {
    console.error('[messageController.listarConversas]', err);
    res.status(500).json({ erro: 'Erro ao listar conversas.' });
  }
};

exports.listarTrades = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const trades = await Trade.findAll({
      where: {
        [Op.or]: [
          { solicitante_id: usuarioId },
          { receptor_id: usuarioId },
        ],
      },
      include: [
        { model: User, as: 'solicitante', attributes: ['id', 'nome'] },
        { model: User, as: 'receptor',    attributes: ['id', 'nome'] },
        { model: Item, as: 'itemOferecido', attributes: ['id', 'titulo'] },
        { model: Item, as: 'itemDesejado',  attributes: ['id', 'titulo'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    const resultado = trades.map((trade) => {
      const outraParte =
        trade.solicitante_id === usuarioId ? trade.receptor : trade.solicitante;
      return { trade, outraParte };
    });

    res.json(resultado);
  } catch (err) {
    console.error('[messageController.listarTrades]', err);
    res.status(500).json({ erro: 'Erro ao listar trades.' });
  }
};

exports.listarMensagens = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const { tradeId } = req.params;

    const trade = await Trade.findOne({
      where: {
        id: tradeId,
        [Op.or]: [
          { solicitante_id: usuarioId },
          { receptor_id: usuarioId },
        ],
      },
      include: [
        { model: User, as: 'solicitante', attributes: ['id', 'nome'] },
        { model: User, as: 'receptor',    attributes: ['id', 'nome'] },
        { model: Item, as: 'itemOferecido', attributes: ['id', 'titulo', 'imagem_url'] },
        { model: Item, as: 'itemDesejado',  attributes: ['id', 'titulo', 'imagem_url'] },
      ],
    });

    if (!trade) {
      return res.status(403).json({ erro: 'Acesso negado a esta conversa.' });
    }

    const mensagens = await Message.findAll({
      where: { trade_id: tradeId },
      include: [{ model: User, as: 'remetente', attributes: ['id', 'nome'] }],
      order: [['createdAt', 'ASC']],
    });

    await Message.update(
      { lida: true },
      {
        where: {
          trade_id: tradeId,
          remetente_id: { [Op.ne]: usuarioId },
          lida: false,
        },
      }
    );

    res.json({ trade, mensagens });
  } catch (err) {
    console.error('[messageController.listarMensagens]', err);
    res.status(500).json({ erro: 'Erro ao buscar mensagens.' });
  }
};

exports.enviarMensagem = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const { tradeId } = req.params;
    const { texto } = req.body;

    if (!texto || !texto.trim()) {
      return res.status(400).json({ erro: 'Mensagem não pode ser vazia.' });
    }

    if (texto.trim().length > 2000) {
      return res.status(400).json({ erro: 'Mensagem muito longa (máx. 2000 caracteres).' });
    }

    const trade = await Trade.findOne({
      where: {
        id: tradeId,
        [Op.or]: [
          { solicitante_id: usuarioId },
          { receptor_id: usuarioId },
        ],
      },
    });

    if (!trade) {
      return res.status(403).json({ erro: 'Acesso negado a esta conversa.' });
    }

    const novaMensagem = await Message.create({
      trade_id: Number(tradeId),
      remetente_id: usuarioId,
      texto: texto.trim(),
    });

    const mensagemCompleta = await Message.findByPk(novaMensagem.id, {
      include: [{ model: User, as: 'remetente', attributes: ['id', 'nome'] }],
    });

    const io = req.app.get('io');
    if (io) {
      io.to(`trade_${tradeId}`).emit('nova_mensagem', mensagemCompleta);
    }

    res.status(201).json(mensagemCompleta);
  } catch (err) {
    console.error('[messageController.enviarMensagem]', err);
    res.status(500).json({ erro: 'Erro ao enviar mensagem.' });
  }
};

exports.contarNaoLidas = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const trades = await Trade.findAll({
      where: {
        [Op.or]: [
          { solicitante_id: usuarioId },
          { receptor_id: usuarioId },
        ],
      },
      attributes: ['id'],
    });

    const tradeIds = trades.map((t) => t.id);

    if (tradeIds.length === 0) {
      return res.json({ count: 0 });
    }

    const count = await Message.count({
      where: {
        trade_id: { [Op.in]: tradeIds },
        remetente_id: { [Op.ne]: usuarioId },
        lida: false,
      },
    });

    res.json({ count });
  } catch (err) {
    console.error('[messageController.contarNaoLidas]', err);
    res.json({ count: 0 });
  }
};