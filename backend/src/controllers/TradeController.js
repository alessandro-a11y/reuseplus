const Trade = require('../models/Trade');

module.exports = {
  // Criar uma nova solicitação de troca
  async store(req, res) {
    try {
      const { receiver_id, item_id } = req.body;
      
      // O id de quem envia (sender_id) virá do Token JWT através do middleware de autenticação
      const sender_id = req.userId; 

      // Validação simples para o usuário não trocar com ele mesmo
      if (sender_id === Number(receiver_id)) {
        return res.status(400).json({ error: 'Você não pode propor uma troca com você mesmo.' });
      }

      const trade = await Trade.create({
        sender_id,
        receiver_id,
        item_id,
        status: 'pending' // Começa sempre como pendente
      });

      return res.status(201).json(trade);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao processar a solicitação de troca.' });
    }
  }
};