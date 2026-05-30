# ReUsePlus

## Sobre o Projeto

O ReUsePlus é uma plataforma web desenvolvida com foco em reutilização, troca e reaproveitamento de materiais entre usuários. O sistema foi criado como projeto acadêmico da disciplina de Desenvolvimento Web, utilizando Node.js, Express, Sequelize, PostgreSQL, EJS e autenticação com JWT.

A proposta do sistema é incentivar práticas sustentáveis por meio do compartilhamento e reutilização de itens, reduzindo desperdícios e promovendo economia colaborativa.

---

# Objetivos do Sistema

- Permitir cadastro e autenticação de usuários
- Disponibilizar itens para troca ou reutilização
- Gerenciar solicitações de troca entre usuários
- Organizar informações de forma segura e estruturada
- Aplicar arquitetura web completa utilizando backend, frontend e banco de dados

---

# Tecnologias Utilizadas

## Backend
- Node.js
- Express
- Sequelize ORM
- PostgreSQL
- JWT
- bcryptjs
- dotenv

## Frontend
- EJS
- CSS
- JavaScript
- Express EJS Layouts

## Controle de Versão
- Git
- GitHub

---

# Arquitetura do Projeto

```txt
ReUsePlus/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── package.json
│   └── .gitignore
│
├── frontend/
│   ├── public/
│   │   ├── css/
│   │   ├── js/
│   │   └── img/
│   │
│   ├── views/
│   │   ├── layouts/
│   │   ├── partials/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── items/
│   │   ├── trades/
│   │   ├── profile/
│   │   └── errors/
│   │
│   ├── package.json
│   └── .gitignore
│
└── README.md
