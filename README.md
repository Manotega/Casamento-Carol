# Carolina e André - Wedding Website

Um site de casamento com sistema de confirmação de presença dos convidados.

## Funcionalidades

- Site responsivo para o casamento
- Sistema de confirmação de presença
- Contador de dias para o casamento
- Armazenamento simples de dados em JSON
- Interface moderna e elegante

## Instalação e Configuração

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm (vem com o Node.js)

### Passos para instalação

1. **Clone ou baixe o projeto**

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Inicie o servidor**
   ```bash
   npm start
   ```

4. **Acesse o site**
   Abra seu navegador e vá para: `http://localhost:3000`

### Desenvolvimento

Para desenvolvimento com auto-reload:
```bash
npm run dev
```

## Estrutura do Projeto

```
cArolinA/
├── index.html          # Página principal
├── presentes.html      # Página de presentes
├── script.js           # JavaScript do frontend
├── styles.css          # Estilos CSS
├── server.js           # Servidor Node.js
├── package.json        # Dependências do projeto
├── guests.json         # Banco de dados (criado automaticamente)
└── assets/             # Arquivos de mídia
    ├── logos/
    ├── presentes/
    └── ...
```

## API Endpoints

### POST /api/confirm-presence
Confirma a presença de um convidado.

**Body:**
```json
{
  "name": "Nome do Convidado"
}
```

**Resposta de sucesso:**
```json
{
  "success": true,
  "message": "Presença confirmada com sucesso!",
  "guest": {
    "name": "Nome do Convidado",
    "confirmedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### GET /api/guests
Lista todos os convidados confirmados.

**Resposta:**
```json
{
  "success": true,
  "guests": [
    {
      "name": "Nome do Convidado",
      "confirmedAt": "2024-01-01T12:00:00.000Z"
    }
  ],
  "total": 1
}
```

### GET /api/health
Verifica o status do servidor.

## Banco de Dados

Os dados são armazenados em um arquivo JSON simples (`guests.json`) que é criado automaticamente quando o servidor é iniciado pela primeira vez.

Estrutura do arquivo:
```json
{
  "guests": [
    {
      "name": "Nome do Convidado",
      "confirmedAt": "2024-01-01T12:00:00.000Z"
    }
  ],
  "createdAt": "2024-01-01T12:00:00.000Z"
}
```

## Funcionalidades do Frontend

- **Confirmação de presença**: Os usuários podem digitar seu nome e confirmar presença
- **Validação**: Verifica se o nome já foi confirmado anteriormente
- **Feedback visual**: Mensagens de sucesso/erro aparecem no canto superior direito
- **Responsividade**: Funciona em dispositivos móveis e desktop
- **Contador de dias**: Mostra quantos dias faltam para o casamento

## Personalização

Para personalizar o site:

1. **Data do casamento**: Edite a linha 30 em `script.js`
2. **Estilos**: Modifique `styles.css`
3. **Conteúdo**: Edite `index.html` e `presentes.html`
4. **Porta do servidor**: Altere a variável `PORT` em `server.js`

## Deploy

Para fazer deploy em produção:

1. **Serviços recomendados**:
   - Heroku
   - Vercel
   - Railway
   - DigitalOcean

2. **Variáveis de ambiente**:
   - `PORT`: Porta do servidor (opcional, padrão: 3000)

3. **Comandos de build**:
   ```bash
   npm install --production
   npm start
   ```

## Suporte

Para dúvidas ou problemas, verifique:
1. Se o Node.js está instalado corretamente
2. Se todas as dependências foram instaladas
3. Se a porta 3000 está disponível
4. Os logs do console para erros específicos