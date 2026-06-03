const { Op } = require('sequelize');
const Rating = require('../models/rating');
const Trade  = require('../models/trade');
const User   = require('../models/user');

// POST /api/ratings — criar avaliação
const criar = async (req, res) => {
  try {
    const { trade_id, nota, comentario } = req.body;

    if (!trade_id || !nota)
      return res.status(400).json({ erro: 'Informe a troca e a nota' });
    if (nota < 1 || nota > 5)
      return res.status(400).json({ erro: 'Nota deve ser entre 1 e 5' });

    // Verifica se a troca existe e está concluída
    const trade = await Trade.findByPk(trade_id);
    if (!trade)
      return res.status(404).json({ erro: 'Troca não encontrada' });
    if (trade.status !== 'concluida')
      return res.status(400).json({ erro: 'Só é possível avaliar trocas concluídas' });

    // Verifica se o usuário participou da troca
    const ehSolicitante = trade.solicitante_id === req.user.id;
    const ehReceptor    = trade.receptor_id    === req.user.id;
    if (!ehSolicitante && !ehReceptor)
      return res.status(403).json({ erro: 'Você não participou desta troca' });

    // Define quem é o avaliado (o outro participante)
    const avaliado_id = ehSolicitante ? trade.receptor_id : trade.solicitante_id;

    // Impede avaliação duplicada
    const jaAvaliou = await Rating.findOne({
      where: { avaliador_id: req.user.id, trade_id }
    });
    if (jaAvaliou)
      return res.status(400).json({ erro: 'Você já avaliou esta troca' });

    const rating = await Rating.create({
      avaliador_id: req.user.id,
      avaliado_id,
      trade_id,
      nota,
      comentario
    });

    res.status(201).json(rating);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError')
      return res.status(400).json({ erro: 'Você já avaliou esta troca' });
    res.status(500).json({ erro: err.message });
  }
};

// GET /api/ratings/me — avaliações que eu recebi
const minhas = async (req, res) => {
  try {
    const ratings = await Rating.findAll({
      where: { avaliado_id: req.user.id },
      include: [
        { model: User,  as: 'avaliador', attributes: ['id', 'nome'] },
        { model: Trade, as: 'trade',     attributes: ['id'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    const total = ratings.length;
    const media = total > 0
      ? (ratings.reduce((s, r) => s + r.nota, 0) / total).toFixed(1)
      : '0.0';

    // Distribuição por nota
    const distribuicao = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach(r => distribuicao[r.nota]++);

    res.status(200).json({ media, total, distribuicao, ratings });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// GET /api/ratings/usuario/:id — avaliações de outro usuário (perfil público)
const porUsuario = async (req, res) => {
  try {
    const ratings = await Rating.findAll({
      where: { avaliado_id: req.params.id },
      include: [
        { model: User,  as: 'avaliador', attributes: ['id', 'nome'] },
        { model: Trade, as: 'trade',     attributes: ['id'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    const total = ratings.length;
    const media = total > 0
      ? (ratings.reduce((s, r) => s + r.nota, 0) / total).toFixed(1)
      : '0.0';

    const distribuicao = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach(r => distribuicao[r.nota]++);

    res.status(200).json({ media, total, distribuicao, ratings });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// GET /api/ratings/pode-avaliar/:trade_id — verifica se pode avaliar esta troca
const podeAvaliar = async (req, res) => {
  try {
    const trade = await Trade.findByPk(req.params.trade_id);
    if (!trade || trade.status !== 'concluida')
      return res.status(200).json({ pode: false, motivo: 'Troca não concluída' });

    const participou = trade.solicitante_id === req.user.id || trade.receptor_id === req.user.id;
    if (!participou)
      return res.status(200).json({ pode: false, motivo: 'Você não participou desta troca' });

    const jaAvaliou = await Rating.findOne({
      where: { avaliador_id: req.user.id, trade_id: req.params.trade_id }
    });

    if (jaAvaliou)
      return res.status(200).json({ pode: false, motivo: 'Você já avaliou esta troca' });

    return res.status(200).json({ pode: true });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

module.exports = { criar, minhas, porUsuario, podeAvaliar };