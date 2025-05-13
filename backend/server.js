import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cors from 'cors';

const app = express();
const PORT = 3001;
app.use(cors());
app.use(express.json());

let db;

(async () => {
  db = await open({
    filename: './db.sqlite', // Cambiado para que la base quede en la carpeta backend
    driver: sqlite3.Database
  });
  await db.run(`CREATE TABLE IF NOT EXISTS standings (
    id TEXT PRIMARY KEY,
    sport TEXT,
    equipo TEXT,
    puntos INTEGER,
    goles_favor INTEGER,
    goles_contra INTEGER,
    otros TEXT
  )`);
})();

// Obtener standings por deporte
app.get('/standings/:sport', async (req, res) => {
  const { sport } = req.params;
  const rows = await db.all('SELECT * FROM standings WHERE sport = ?', sport);
  res.json(rows);
});

// Reemplazar standings por deporte
app.post('/standings/:sport', async (req, res) => {
  const { sport } = req.params;
  const standings = req.body;
  await db.run('DELETE FROM standings WHERE sport = ?', sport);
  const insert = db.prepare('INSERT INTO standings (id, sport, equipo, puntos, goles_favor, goles_contra, otros) VALUES (?, ?, ?, ?, ?, ?, ?)');
  for (const row of standings) {
    await insert.run(row.id, sport, row.Equipo, row.Puntos, row.GF, row.GC, JSON.stringify(row.otros || {}));
  }
  await insert.finalize();
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Backend de standings escuchando en http://localhost:${PORT}`);
});
