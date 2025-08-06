import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors()); // Habilita o CORS para todas as rotas
// const port = 4001; // Porta do seu backend
// const frontendPort = 3000; // Porta do seu frontend
// app.use((req, res, next) => {
//        res.header('Access-Control-Allow-Origin', `http://localhost:${frontendPort}`); // Permite acesso da porta 3001
//        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Métodos permitidos
//        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Headers permitidos
//        next();
//      });

// Configuração do banco
const db = mysql.createConnection({
         host: '127.0.0.1',
         user: 'root',
         password: '1234',
         database: 'teste',
         port: 3305,
     });

app.post('/api/cadastrar', (req, res) => {
 const { caixa_id, modelo, placa_veiculo, lado, andar, vaga, data_entrada } = req.body;
  db.query(
    'INSERT INTO transacoes (caixa_id, modelo, placa_veiculo, lado, andar, vaga, entrada) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [caixa_id, modelo, placa_veiculo, lado, andar, vaga, data_entrada],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.get('/api/cadastrar', (req, res) => {
  // Seleciona as colunas necessárias e renomeia `placa_veiculo` para `placa` para corresponder à interface do frontend.
  const query = 'SELECT id, modelo, placa_veiculo as placa, lado, andar, vaga, entrada FROM transacoes WHERE saida IS NULL';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    // Envolve a resposta em um objeto `{ carros: ... }` como esperado pelo frontend.
    res.json({ carros: results });
  });
});

app.listen(3000, () => {
  console.log('API rodando na porta 4001');
});