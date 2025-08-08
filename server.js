require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Servir arquivos estáticos do diretório atual

// Redirects canônicos para evitar exibir .html nas URLs
app.get(['/index.html', '/presentes.html'], (req, res) => {
  const target = req.path === '/index.html' ? '/' : '/presentes';
  return res.redirect(301, target);
});

app.get('/paginas-individuais-presentes/:slug.html', (req, res) => {
  return res.redirect(301, `/presentes/${req.params.slug}`);
});

// URLs limpas: mapear /presentes/:slug -> paginas-individuais-presentes/:slug.html
// e mapear qualquer caminho sem extensão para arquivo .html correspondente na raiz
app.get(/^\/(?!api\/).*$/, (req, res, next) => {
  // Ignora requisições que já têm extensão (ex.: .css, .js, .png etc.)
  if (path.extname(req.path)) return next();

  // Regra específica: /presentes/:slug -> paginas-individuais-presentes/:slug.html
  const matchGift = req.path.match(/^\/presentes\/([^\/]+)\/?$/);
  if (matchGift) {
    const fileForGift = path.join(
      __dirname,
      'paginas-individuais-presentes',
      `${matchGift[1]}.html`
    );
    if (fs.existsSync(fileForGift)) {
      return res.sendFile(fileForGift);
    }
  }

  // Regra genérica: "/abc" -> "abc.html" na raiz do projeto
  const cleanPath = req.path.replace(/\/+$/, '') || '/index';
  const candidate = path.join(__dirname, `${cleanPath}.html`);
  if (fs.existsSync(candidate)) {
    return res.sendFile(candidate);
  }

  return next();
});

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rotas da API
app.post('/api/confirm-presence', async (req, res) => {
  console.log('POST /api/confirm-presence chamado');
  console.log('Corpo da requisição:', req.body);
  
  try {
    const { name } = req.body;
    
    if (!name || name.trim() === '') {
      console.log('Nome vazio fornecido');
      return res.status(400).json({ 
        success: false, 
        message: 'Nome é obrigatório' 
      });
    }

    const trimmedName = name.trim();
    console.log('Processando nome:', trimmedName);
    
    // Verifica se o nome já existe
    const { data: existingGuests, error: checkError } = await supabase
      .from('guests')
      .select('name')
      .ilike('name', trimmedName);
    
    if (checkError) {
      console.error('Erro ao verificar convidado existente:', checkError);
      return res.status(500).json({ 
        success: false, 
        message: 'Erro ao verificar convidado existente' 
      });
    }
    
    if (existingGuests && existingGuests.length > 0) {
      console.log('Nome já existe:', trimmedName);
      return res.status(409).json({ 
        success: false, 
        message: 'Este nome já foi confirmado' 
      });
    }

    // Adiciona novo convidado
    const { data: newGuest, error: insertError } = await supabase
      .from('guests')
      .insert([{ name: trimmedName }])
      .select();
    
    if (insertError) {
      console.error('Erro ao inserir convidado:', insertError);
      return res.status(500).json({ 
        success: false, 
        message: 'Erro ao salvar confirmação' 
      });
    }
    
    console.log('Convidado salvo com sucesso:', newGuest[0]);
    res.json({ 
      success: true, 
      message: 'Presença confirmada com sucesso!',
      guest: newGuest[0]
    });
    
  } catch (error) {
    console.error('Erro ao confirmar presença:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// Buscar todos os convidados confirmados
app.get('/api/guests', async (req, res) => {
  console.log('GET /api/guests chamado');
  try {
    const { data: guests, error } = await supabase
      .from('guests')
      .select('*')
      .order('name', { ascending: true }); // Ordena por nome alfabeticamente
    
    if (error) {
      console.error('Erro ao buscar convidados:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Erro ao buscar convidados' 
      });
    }
    
    console.log('Retornando convidados:', guests.length);
    res.json({ 
      success: true, 
      guests: guests || [],
      total: guests ? guests.length : 0
    });
  } catch (error) {
    console.error('Erro ao buscar convidados:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao buscar convidados' 
    });
  }
});

// Endpoint de verificação de saúde
app.get('/api/health', (req, res) => {
  console.log('GET /api/health chamado');
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: 'Supabase'
  });
});

// Endpoint de administração para gerenciar convidados
app.post('/api/admin/manage', async (req, res) => {
  console.log('POST /api/admin/manage chamado');
  console.log('Corpo da requisição:', req.body);
  
  const { action, name, newName } = req.body;
  
  try {
    switch (action) {
      case 'delete':
        // Remover um convidado específico
        const { data: deletedGuest, error: deleteError } = await supabase
          .from('guests')
          .delete()
          .eq('name', name)
          .select();
        
        if (deleteError) {
          console.error('Erro ao remover convidado:', deleteError);
          return res.status(500).json({ 
            success: false, 
            message: 'Erro ao remover convidado' 
          });
        }
        
        if (deletedGuest && deletedGuest.length > 0) {
          res.json({ 
            success: true, 
            message: `Convidado "${deletedGuest[0].name}" removido`,
            removed: deletedGuest[0]
          });
        } else {
          res.json({ 
            success: false, 
            message: 'Convidado não encontrado' 
          });
        }
        break;
        
      case 'edit':
        // Editar nome de um convidado
        const { data: updatedGuest, error: updateError } = await supabase
          .from('guests')
          .update({ name: newName })
          .eq('name', name)
          .select();
        
        if (updateError) {
          console.error('Erro ao atualizar convidado:', updateError);
          return res.status(500).json({ 
            success: false, 
            message: 'Erro ao atualizar convidado' 
          });
        }
        
        if (updatedGuest && updatedGuest.length > 0) {
          res.json({ 
            success: true, 
            message: `Nome alterado de "${name}" para "${newName}"`,
            updated: updatedGuest[0]
          });
        } else {
          res.json({ 
            success: false, 
            message: 'Convidado não encontrado' 
          });
        }
        break;
        
      case 'clear':
        // Limpar toda a lista de convidados
        const { error: clearError } = await supabase
          .from('guests')
          .delete()
          .neq('name', ''); // Deleta todos os registros (qualquer nome não vazio)
        
        if (clearError) {
          console.error('Erro ao limpar lista de convidados:', clearError);
          return res.status(500).json({ 
            success: false, 
            message: 'Erro ao limpar lista' 
          });
        }
        
        res.json({ 
          success: true, 
          message: 'Lista de convidados limpa',
          total: 0
        });
        break;
        
      default:
        res.json({ 
          success: false, 
          message: 'Ação não reconhecida. Use: delete, edit, ou clear' 
        });
    }
    
  } catch (error) {
    console.error('Erro ao gerenciar convidados:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Banco de dados: Supabase`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});