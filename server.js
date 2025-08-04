require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.post('/api/confirm-presence', async (req, res) => {
  console.log('POST /api/confirm-presence called');
  console.log('Request body:', req.body);
  
  try {
    const { name } = req.body;
    
    if (!name || name.trim() === '') {
      console.log('Empty name provided');
      return res.status(400).json({ 
        success: false, 
        message: 'Nome é obrigatório' 
      });
    }

    const trimmedName = name.trim();
    console.log('Processing name:', trimmedName);
    
    // Check if name already exists
    const { data: existingGuests, error: checkError } = await supabase
      .from('guests')
      .select('name')
      .ilike('name', trimmedName);
    
    if (checkError) {
      console.error('Error checking existing guest:', checkError);
      return res.status(500).json({ 
        success: false, 
        message: 'Erro ao verificar convidado existente' 
      });
    }
    
    if (existingGuests && existingGuests.length > 0) {
      console.log('Name already exists:', trimmedName);
      return res.status(409).json({ 
        success: false, 
        message: 'Este nome já foi confirmado' 
      });
    }

    // Add new guest
    const { data: newGuest, error: insertError } = await supabase
      .from('guests')
      .insert([{ name: trimmedName }])
      .select();
    
    if (insertError) {
      console.error('Error inserting guest:', insertError);
      return res.status(500).json({ 
        success: false, 
        message: 'Erro ao salvar confirmação' 
      });
    }
    
    console.log('Guest saved successfully:', newGuest[0]);
    res.json({ 
      success: true, 
      message: 'Presença confirmada com sucesso!',
      guest: newGuest[0]
    });
    
  } catch (error) {
    console.error('Error confirming presence:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// Get all confirmed guests
app.get('/api/guests', async (req, res) => {
  console.log('GET /api/guests called');
  try {
    const { data: guests, error } = await supabase
      .from('guests')
      .select('*')
      .order('name', { ascending: true }); // Ordena por nome alfabeticamente
    
    if (error) {
      console.error('Error getting guests:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Erro ao buscar convidados' 
      });
    }
    
    console.log('Returning guests:', guests.length);
    res.json({ 
      success: true, 
      guests: guests || [],
      total: guests ? guests.length : 0
    });
  } catch (error) {
    console.error('Error getting guests:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao buscar convidados' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('GET /api/health called');
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: 'Supabase'
  });
});

// Endpoint de administração para gerenciar convidados
app.post('/api/admin/manage', async (req, res) => {
  console.log('POST /api/admin/manage called');
  console.log('Request body:', req.body);
  
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
          console.error('Error deleting guest:', deleteError);
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
          console.error('Error updating guest:', updateError);
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
        // Limpar toda a lista
        const { error: clearError } = await supabase
          .from('guests')
          .delete()
          .neq('name', ''); // Delete all records (qualquer nome não vazio)
        
        if (clearError) {
          console.error('Error clearing guests:', clearError);
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
    console.error('Error managing guests:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database: Supabase`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});