const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Database file path
const dbPath = path.join(__dirname, 'guests.json');

// Initialize database if it doesn't exist
function initializeDatabase() {
  if (!fs.existsSync(dbPath)) {
    const initialData = {
      guests: [],
      createdAt: new Date().toISOString()
    };
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
  }
}

// Read database
function readDatabase() {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { guests: [] };
  }
}

// Write to database
function writeDatabase(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing to database:', error);
    return false;
  }
}

// Initialize database on startup
initializeDatabase();

// API Routes
app.post('/api/confirm-presence', (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'Nome é obrigatório' 
      });
    }

    const trimmedName = name.trim();
    const db = readDatabase();
    
    // Check if name already exists
    const existingGuest = db.guests.find(guest => 
      guest.name.toLowerCase() === trimmedName.toLowerCase()
    );
    
    if (existingGuest) {
      return res.status(409).json({ 
        success: false, 
        message: 'Este nome já foi confirmado' 
      });
    }

    // Add new guest
    const newGuest = {
      name: trimmedName,
      confirmedAt: new Date().toISOString()
    };
    
    db.guests.push(newGuest);
    
    if (writeDatabase(db)) {
      res.json({ 
        success: true, 
        message: 'Presença confirmada com sucesso!',
        guest: newGuest
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Erro ao salvar confirmação' 
      });
    }
    
  } catch (error) {
    console.error('Error confirming presence:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// Get all confirmed guests (optional - for admin purposes)
app.get('/api/guests', (req, res) => {
  try {
    const db = readDatabase();
    res.json({ 
      success: true, 
      guests: db.guests,
      total: db.guests.length
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
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString() 
  });
});

// Endpoint de administração para gerenciar convidados
app.post('/api/admin/manage', (req, res) => {
  console.log('POST /api/admin/manage called');
  console.log('Request body:', req.body);
  
  const { action, name, newName } = req.body;
  
  try {
    const db = readDatabase();
    
    switch (action) {
      case 'delete':
        // Remover um convidado específico
        const deleteIndex = db.guests.findIndex(guest => 
          guest.name.toLowerCase() === name.toLowerCase()
        );
        
        if (deleteIndex > -1) {
          const removedGuest = db.guests.splice(deleteIndex, 1)[0];
          writeDatabase(db);
          res.json({ 
            success: true, 
            message: `Convidado "${removedGuest.name}" removido`,
            removed: removedGuest
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
        const editIndex = db.guests.findIndex(guest => 
          guest.name.toLowerCase() === name.toLowerCase()
        );
        
        if (editIndex > -1) {
          db.guests[editIndex].name = newName;
          db.guests[editIndex].updatedAt = new Date().toISOString();
          writeDatabase(db);
          res.json({ 
            success: true, 
            message: `Nome alterado de "${name}" para "${newName}"`,
            updated: db.guests[editIndex]
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
        db.guests = [];
        db.clearedAt = new Date().toISOString();
        writeDatabase(db);
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
  console.log(`Database file: ${dbPath}`);
});