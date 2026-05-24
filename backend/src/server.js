const app = require('./app');
const sequelize = require('./config/database');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => sequelize.sync({ alter: true }))
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    process.exit(1);
  });