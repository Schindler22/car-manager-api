const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Rota para adicionar um carro
app.post('/car', (req, res) => {
  const { ano, chassi, marca, modelo, placa, renavam } = req.body;
  db.run(`INSERT INTO CARS (ano, chassi, marca, modelo, placa, renavam) VALUES (?, ?, ?, ?, ?, ?)`,
    [ano, chassi, marca, modelo, placa, renavam],
    function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: this.lastID });
    }
  );
});

//Rota para atualizar um carro existente
app.put('/car/:id', (req, res) => {
    const { id } = req.params;
    const { ano, chassi, marca, modelo, placa, renavam } = req.body;

    // Verifique se todos os campos necessários estão presentes na requisição
    if (!ano || !chassi || !marca || !modelo || !placa || !renavam) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Atualize o registro no banco de dados
    db.run(
        `UPDATE CARS SET ano = ?, chassi = ?, marca = ?, modelo = ?, placa = ?, renavam = ? WHERE id = ?`,
        [ano, chassi, marca, modelo, placa, renavam, id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: `Carro com ID ${id} atualizado com sucesso` });
        }
    );
});

// Rota para listar todos os carros
app.get('/cars', (req, res) => {
  db.all(`SELECT * FROM CARS`, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Rota para listar um carro pelo ID
app.get('/car/:id', (req, res) => {
  const id = req.params.id;
  db.get(`SELECT * FROM CARS WHERE id = ?`, [id], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});

// Rota para deletar um carro pelo ID
app.delete('/car/:id', (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM CARS WHERE id = ?`, [id], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ deletedID: id, changes: this.changes });
  });
});

// Rota para listar todas as marcas
app.get('/cars/brands', (req, res) => {
  db.all(`SELECT * FROM BRANDS`, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Rota para adicionar uma marca
app.post('/cars/brands', (req, res) => {
  const { marca } = req.body;
  db.run(`INSERT INTO BRANDS (marca) VALUES (?)`,
    [marca],
    function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: this.lastID });
    }
  );
});

// Rota para listar modelos por marca
app.get('/cars/models', (req, res) => {
  const brand = req.query.brand;
  console.log("brand", brand)

  db.get('SELECT id FROM BRANDS WHERE marca = ?', [brand], (err, row) => {
    if (err) {
        console.error('Erro ao executar consulta:', err.message);
        return;
    }
    if (!row) {
        console.log('Marca não encontrada');
        return;
    }
    const idMarca = row.id;
    console.log("idMarca", idMarca)
    
    db.all(`SELECT modelo FROM MODELS WHERE idmarca = ?`, [idMarca], (err, rows) => {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
        res.json(rows.map(item => item.modelo));
    });
});

  
});

// Rota para adicionar um modelo
app.post('/cars/models', (req, res) => {
  const { idmarca, modelo } = req.body;
  db.run(`INSERT INTO MODELS (idmarca, modelo) VALUES (?, ?)`,
    [idmarca, modelo],
    function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: this.lastID });
    }
  );
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
