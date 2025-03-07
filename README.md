# Framework Releases API

API para acompanhamento de lançamentos dos principais frameworks do mercado, incluindo breaking changes e informações úteis.

## Funcionalidades

- Acompanhamento de versões de frameworks
- Detecção automática de novas versões
- Registro de breaking changes
- Informações sobre documentação e repositórios

## Requisitos

- Node.js (v14 ou superior)
- MongoDB
- Token do GitHub (para verificação de atualizações)

## Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd framework-releases
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
- Copie o arquivo `.env.example` para `.env`
- Preencha as variáveis necessárias:
  - PORT: Porta do servidor (padrão: 3000)
  - MONGODB_URI: URI do MongoDB
  - GITHUB_TOKEN: Token de acesso do GitHub

4. Inicie o servidor:
```bash
npm run dev
```

## Endpoints

### GET /api/frameworks
Lista todos os frameworks cadastrados

### GET /api/frameworks/:name
Busca um framework específico pelo nome

### POST /api/frameworks
Adiciona um novo framework

### PUT /api/frameworks/:name
Atualiza informações de um framework

### POST /api/frameworks/check-updates
Verifica atualizações disponíveis para todos os frameworks

## Estrutura do Projeto

```
src/
  ├── controllers/    # Controladores da aplicação
  ├── models/        # Modelos do MongoDB
  ├── routes/        # Rotas da API
  ├── types/         # Tipos TypeScript
  └── index.ts       # Arquivo principal
```

## Contribuição

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request 