require('dotenv').config();

module.exports = {
  development: {
    dialect: 'postgres',
    url: process.env.DATABASE_URL,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    },
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true,
    },
  }
};