const express = require('express');
const app = express();

const sequelize = require('./config/database');
const Item = require('./models/item.js');
const itemRoutes = require('./routes/itemRoutes');

app.use(express.json());
app.use('/items', itemRoutes);

sequelize.sync({ force: false }).then(() => {
  console.log('Banco sincronizado!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;