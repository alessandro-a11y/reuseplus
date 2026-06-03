# ReUsePlus

## Sobre o Projeto

O ReUsePlus é uma plataforma web desenvolvida com foco em reutilização, troca e reaproveitamento de materiais entre usuários. O sistema foi criado como projeto acadêmico da disciplina de Desenvolvimento Web.

A proposta do sistema é incentivar práticas sustentáveis por meio do compartilhamento e reutilização de itens, reduzindo desperdícios e promovendo economia colaborativa.

---

# Objetivos do Sistema

- Permitir cadastro e autenticação de usuários
- Disponibilizar itens para troca ou reutilização
- Gerenciar solicitações de troca entre usuários
- Implementar sistema de avaliações e ratings de usuários
- Organizar informações de forma segura e estruturada
- Aplicar arquitetura web completa utilizando backend, frontend e banco de dados

---

# Funcionalidades Principais

## Autenticação e Perfis
- Cadastro e autenticação segura com JWT
- Criptografia de senhas com bcryptjs
- Gerenciamento de perfis de usuários
- Melhorias na experiência de autenticação

## Gerenciamento de Itens
- Cadastro e listagem de itens
- Exploração avançada de itens disponíveis
- Organização e categorização de itens
- Favoritos/Itens favoritos
- Melhorias na usabilidade do gerenciamento

## Sistema de Trocas
- Criação de solicitações de troca
- Histórico de trocas realizadas
- Acompanhamento do status das trocas
- Fluxo melhorado de negociação

## Sistema de Avaliações
- Avaliações e ratings de usuários
- Visualização de índice de avaliações
- Registro e histórico de feedbacks
- Construção de reputação na plataforma

## Mensageria
- Sistema de mensagens entre usuários
- Comunicação durante negociações
- Histórico de conversas

## Impacto Ambiental
- Rastreamento do impacto ecológico das trocas
- Estatísticas de CO2 evitado
- Dashboard de impacto

## Dashboard
- Interface intuitiva de usuário
- Visualização de informações consolidadas
- Acesso rápido a funcionalidades principais
- Experiência de usuário aprimorada

---

# Tecnologias Utilizadas

## Backend
- Node.js
- Express
- Sequelize ORM
- PostgreSQL
- JWT (JSON Web Tokens)
- bcryptjs
- dotenv
- CORS
- Helmet

## Frontend
- EJS (Templates)
- CSS (Styled Components)
- JavaScript (vanilla)
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
│   │   │   ├── database.js          # Configuração do Sequelize e PostgreSQL
│   │   │   └── env.js               # Variáveis de ambiente
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js    # Lógica de autenticação
│   │   │   ├── itemController.js    # Gerenciamento de itens
│   │   │   ├── tradeController.js   # Gerenciamento de trocas
│   │   │   ├── favoriteController.js # Gerenciamento de favoritos
│   │   │   ├── ratingController.js  # Sistema de avaliações
│   │   │   └── messageController.js # Sistema de mensagens
│   │   │
│   │   ├── models/
│   │   │   ├── user.js              # Modelo de usuário
│   │   │   ├── item.js              # Modelo de item
│   │   │   ├── trade.js             # Modelo de troca
│   │   │   ├── favorite.js          # Modelo de favoritos
│   │   │   ├── rating.js            # Modelo de avaliações
│   │   │   └── message.js           # Modelo de mensagens
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js        # Rotas de autenticação
│   │   │   ├── itemRoutes.js        # Rotas de itens
│   │   │   ├── tradeRoutes.js       # Rotas de trocas
│   │   │   ├── favoriteRoutes.js    # Rotas de favoritos
│   │   │   ├── ratingRoutes.js      # Rotas de avaliações
│   │   │   ├── messageRoutes.js     # Rotas de mensagens
│   │   │   └── notificationRoutes.js # Rotas de notificações
│   │   │
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js    # Middleware de autenticação
│   │   │   └── errorHandler.js      # Tratamento de erros
│   │   │
│   │   ├── services/
│   │   │   ├── authService.js       # Serviços de autenticação
│   │   │   ├── itemService.js       # Serviços de itens
│   │   │   ├── tradeService.js      # Serviços de trocas
│   │   │   ├── ratingService.js     # Serviços de avaliações
│   │   │   └── messageService.js    # Serviços de mensagens
│   │   │
│   │   ├── app.js                    # Configuração da aplicação Express
│   │   └── server.js                 # Inicialização do servidor
│   │
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── frontend/
│   ├── public/
│   │   ├── css/
│   │   │   ├── dashboard.css        # Estilos principais
│   │   │   ├── auth.css             # Estilos de autenticação
│   │   │   └── responsive.css       # Estilos responsivos
│   │   │
│   │   ├── js/
│   │   │   ├── api.js               # Cliente HTTP/fetch
│   │   │   ├── utils.js             # Funções utilitárias
│   │   │   └── notifications.js     # Gerenciamento de notificações
│   │   │
│   │   └── img/
│   │       └── (ícones e imagens)
│   │
│   ├── views/
│   │   ├── layouts/
│   │   │   └── main.ejs             # Layout principal
│   │   │
│   │   ├── partials/
│   │   │   ├── sidebar.ejs          # Barra lateral
│   │   │   ├── navbar.ejs           # Barra de navegação
│   │   │   └── footer.ejs           # Rodapé
│   │   │
│   │   ├── auth/
│   │   │   ├── login.ejs            # Página de login
│   │   │   ├── register.ejs         # Página de registro
│   │   │   └── forgot-password.ejs  # Recuperação de senha
│   │   │
│   │   ├── dashboard/
│   │   │   └── index.ejs            # Dashboard principal
│   │   │
│   │   ├── items/
│   │   │   ├── list.ejs             # Listagem de itens do usuário
│   │   │   ├── create.ejs           # Criar novo item
│   │   │   ├── edit.ejs             # Editar item
│   │   │   ├── explore.ejs          # Explorar itens disponíveis
│   │   │   └── details.ejs          # Detalhes do item
│   │   │
│   │   ├── trades/
│   │   │   ├── list.ejs             # Listagem de trocas
│   │   │   ├── request.ejs          # Solicitar troca
│   │   │   └── history.ejs          # Histórico de trocas
│   │   │
│   │   ├── profile/
│   │   │   ├── index.ejs            # Perfil do usuário
│   │   │   └── edit.ejs             # Editar perfil
│   │   │
│   │   ├── ratings/
│   │   │   └── index.ejs            # Visualizar avaliações
│   │   │
│   │   ├── favorites/
│   │   │   └── index.ejs            # Itens favoritos
│   │   │
│   │   ├── messages/
│   │   │   ├── list.ejs             # Lista de conversas
│   │   │   └── chat.ejs             # Interface de chat
│   │   │
│   │   ├── impact/
│   │   │   └── index.ejs            # Dashboard de impacto
│   │   │
│   │   ├── settings/
│   │   │   └── index.ejs            # Configurações da conta
│   │   │
│   │   ├── users/
│   │   │   └── profile.ejs          # Perfil público de usuários
│   │   │
│   │   └── errors/
│   │       ├── 404.ejs              # Página não encontrada
│   │       └── 500.ejs              # Erro interno do servidor
│   │
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
└── README.md
```

---

# Configuração e Instalação

## Pré-requisitos
- Node.js (v14+)
- PostgreSQL (v12+)
- npm ou yarn

## Backend
```bash
cd backend
npm install
# Configure o arquivo .env com suas credenciais
npm start
```

## Frontend
```bash
cd frontend
npm install
npm start
```

---

# Variáveis de Ambiente

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/reuseplus
JWT_SECRET=sua_chave_secreta_aqui
PORT=3000
FRONTEND_URL=http://localhost:3001
NODE_ENV=development
```

### Frontend (.env)
```
API_URL=http://localhost:3000
FRONTEND_PORT=3001
```

---

# Histórico de Atualizações Recentes

- ✅ Sistema de Ratings implementado (Controllers, Models, Routes)
- ✅ Melhorias na Dashboard e UX
- ✅ Aprimoramentos no sistema de Autenticação e Perfis
- ✅ Melhorias no gerenciamento de Itens
- ✅ Otimização do fluxo de Trocas
- ✅ Sistema de Mensageria completo
- ✅ Suporte a Favoritos
- ✅ Dashboard de Impacto Ambiental

---

# Estrutura de Dados

## Entidades Principais

### User (Usuário)
- id: INTEGER (PK)
- nome: STRING
- email: STRING (UNIQUE)
- senha: STRING (hashed)
- createdAt: TIMESTAMP
- updatedAt: TIMESTAMP

### Item
- id: INTEGER (PK)
- titulo: STRING
- descricao: TEXT
- categoria: STRING
- estado: ENUM (novo, usado, danificado)
- status_item: ENUM (disponivel, negociacao, trocado)
- usuario_id: INTEGER (FK)
- imagem_url: STRING
- timestamps

### Trade (Troca)
- id: INTEGER (PK)
- usuario_id: INTEGER (FK)
- item_oferecido_id: INTEGER (FK)
- item_solicitado_id: INTEGER (FK)
- status: ENUM (pendente, aceita, recusada, concluida)
- data_solicitacao: TIMESTAMP
- timestamps

### Favorite (Favorito)
- id: INTEGER (PK)
- usuario_id: INTEGER (FK)
- item_id: INTEGER (FK)
- timestamps

### Rating (Avaliação)
- id: INTEGER (PK)
- usuario_id: INTEGER (FK)
- avaliador_id: INTEGER (FK)
- nota: INTEGER (1-5)
- comentario: TEXT
- timestamps

### Message (Mensagem)
- id: INTEGER (PK)
- remetente_id: INTEGER (FK)
- destinatario_id: INTEGER (FK)
- conteudo: TEXT
- lido: BOOLEAN
- timestamps

---

# Contribuições

Este é um projeto acadêmico. Sugestões e melhorias são bem-vindas!

---

# Licença

Este projeto está disponível para fins educacionais.
