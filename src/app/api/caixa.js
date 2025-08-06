import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';


function createDatabaseConnection() {
  return mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '1234',
    database: 'teste',
    port: 3305,
  });
}
const app = express();
app.use(express.json());
const port = 4000; // Porta do seu backend
const frontendPort = 3000; // Porta do seu frontend
app.use(cors()); // Habilita o CORS para todas as rotas
app.use((req, res, next) => {
       res.header('Access-Control-Allow-Origin', `http://localhost:${frontendPort}`); // Permite acesso da porta 3001
       res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Métodos permitidos
       res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Headers permitidos
       next();
     });

app.post('/api/caixa', (req, res) => {
const db = createDatabaseConnection();
  const { data_abertura, valorInicial, operador, valorFinal } = req.body;
  db.query('INSERT INTO caixas (data_abertura, saldo_abertura, saldo_fechamento, operador) VALUES (?, ?, ?, ?)',
    [data_abertura, valorInicial, valorFinal, operador],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
  db.end();
});

app.get('/api/caixa', (req, res) => {
const db = createDatabaseConnection();
  db.query('SELECT * FROM caixas WHERE data_fechamento IS NULL LIMIT 1', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0] || null);
  });
  db.end();
});

app.put('/api/caixa', (req, res) => {
const db = createDatabaseConnection();
  const { valorFinal, dt_saida } = req.body;
  db.query('UPDATE caixas SET valor_final = ?, dt_saida = ? WHERE data_fechamento IS NULL LIMIT 1',
    [valorFinal, dt_saida],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
    db.end();
});

app.listen(port, () => {
  console.log('API rodando na porta 4000');
});