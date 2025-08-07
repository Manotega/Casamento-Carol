# Carolina e André - Wedding Website

Site de casamento moderno com sistema de confirmação de presença integrado ao Supabase.

## ⚠️ Aviso Importante

**O site fica inativo após 15 minutos sem usuários ativos.** Se você acessar através do link do GitHub, é provável que o site esteja inativo, o que pode causar:

- **Demora no carregamento inicial** (pode levar alguns segundos)
- **Bugs visuais temporários** durante o primeiro carregamento
- **Funcionalidades que podem não responder imediatamente**

**Recomendação**: Após o primeiro carregamento, feche o site e abra o link novamente para garantir que não haja erros de visualização ou funcionalidade.

## Funcionalidades

- **Confirmação de presença** com validação em tempo real
- **Sistema de administração** para gerenciar convidados
- **Banco de dados em nuvem** (Supabase)
- **API RESTful** completa com logs detalhados
- **Design responsivo** para mobile e desktop

## Tecnologias

- **Backend**: [![NodeJS](https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white)](#) [![Express.js](https://img.shields.io/badge/Express.js-%23404d59.svg?logo=express&logoColor=%2361DAFB)](#)
- **Banco de Dados**: Supabase [![Postgres](https://img.shields.io/badge/Postgres-%23316192.svg?logo=postgresql&logoColor=white)](#)
- **Frontend**: 
[![CSS](https://img.shields.io/badge/CSS-639?logo=css&logoColor=fff)](#) [![HTML](https://img.shields.io/badge/HTML-%23E34F26.svg?logo=html5&logoColor=white)](#) [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000)](#)
- **Deploy**: Render

## Estrutura do Projeto

```
casamento-carol/
├── index.html                              # Página principal
├── presentes.html                          # Página de presentes
├── paginas-individuais-presentes/          # Páginas individuais de presentes
    ├── compras.html
    ├── perdidos.html
    ├── sushi.html
    ├── styles.css
    └── ...
├── styles.css                              # Estilos principais
├── styles-presentes.css                    # Estilos dos presentes
├── script.js                               # JavaScript frontend
├── server.js                               # Servidor Node.js + Express
├── package.json                            # Dependências
├── .env                                    # Variáveis de ambiente
└── assets/                                 # Arquivos de mídia
    ├── logos/
    ├── presentes/
    ├── qrcode.svg
    ├── pix.svg
    └── ...
```

## Banco de Dados (Supabase)

- **Escalabilidade**: Suporte a milhares de convidados
- **Segurança**: Autenticação e backup automático
- **Interface web**: Gerenciamento visual dos dados

## Funcionalidades

### Frontend
- **Confirmação de presença**: Formulário com validação em tempo real
- **Responsividade**: Funciona em dispositivos móveis e desktop
- **Contador de dias**: Mostra quantos dias faltam para o casamento
- **Página de Presentes**: Cards com navegação para páginas individuais

### Backend
- **API RESTful**: Endpoints para confirmação, listagem e administração
- **Sistema Admin**: Visualizar, editar, remover convidados e limpar lista
- **Logs Detalhados**: Monitoramento completo de todas as operações

## Segurança

- Validação de entrada e prevenção de duplicatas
- Sanitização de dados e CORS configurado
- Logs de auditoria para rastreamento
