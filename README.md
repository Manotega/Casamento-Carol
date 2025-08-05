# Carolina e André - Wedding Website

Site de casamento moderno com sistema de confirmação de presença integrado ao Supabase.

## Funcionalidades

- **Confirmação de presença** com validação em tempo real
- **Sistema de administração** para gerenciar convidados
- **Banco de dados em nuvem** (Supabase)
- **API RESTful** completa com logs detalhados
- **Design responsivo** para mobile e desktop

## Tecnologias

- **Backend**: Node.js + Express
- **Banco de Dados**: Supabase (PostgreSQL)
- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **Deploy**: Render

## Estrutura do Projeto

```
casamento-carol/
├── index.html                              # Página principal
├── presentes.html                          # Página de presentes
├── paginas-individuais-presentes/         # Páginas individuais de presentes
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