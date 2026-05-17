const express = require('express');
const tradeRoutes = require('./routes/tradeRoutes');
require('./database'); // Carrega a inicialização do banco de dados (index.js)

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    // Vincula as suas rotas de troca ao servidor
    this.server.use(tradeRoutes);
  }
}

module.exports = new App().server;