import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Cambia el puerto para Render
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json({ limit: '5mb' }));

let db;

(async () => {
  db = await open({
    filename: './db.sqlite',
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
  )`);  await db.run(`CREATE TABLE IF NOT EXISTS matches (
    id TEXT PRIMARY KEY,
    id_partido TEXT,
    deporte TEXT,
    type_sport TEXT,
    id_equipo TEXT,
    nombre_equipo TEXT,
    icon_equipo TEXT,
    es_local INTEGER,
    goles_favor INTEGER,
    goles_contra INTEGER,
    estado TEXT,
    name_partido TEXT,
    name_cancha TEXT,
    fecha TEXT,
    hora TEXT
  )`);
  await db.run(`CREATE TABLE IF NOT EXISTS news (
    id_noticia TEXT PRIMARY KEY,
    title TEXT,
    subtitle TEXT,
    body TEXT,
    footer TEXT,
    img_portada TEXT
  )`);
})();

// Servir frontend (build) si existe la carpeta dist
const buildPath = path.join(__dirname, '../dist');
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

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
  for (const row of standings) {
    await db.run(
      'INSERT OR REPLACE INTO standings (id, sport, equipo, puntos, goles_favor, goles_contra, otros) VALUES (?, ?, ?, ?, ?, ?, ?)',
      row.id, sport, row.Equipo, row.Puntos, row.GF, row.GC, JSON.stringify(row.otros || {})
    );
  }
  res.json({ ok: true });
});

// Obtener todos los partidos
app.get('/matches', async (req, res) => {
  const rows = await db.all('SELECT * FROM matches ORDER BY id_partido, es_local DESC');
  
  // Agrupar por id_partido para reconstruir los partidos
  const matchesMap = new Map();
  rows.forEach(row => {
    if (!matchesMap.has(row.id_partido)) {
      matchesMap.set(row.id_partido, {
        id_partido: row.id_partido,
        deporte: row.deporte,
        estado: row.estado,
        name_partido: row.name_partido,
        name_cancha: row.name_cancha,
        fecha: row.fecha,
        hora: row.hora,
        equipoLocal: null,
        equipoVisitante: null,
        goles_equipo_1: 0,
        goles_equipo_2: 0
      });
    }
    
    const match = matchesMap.get(row.id_partido);
    if (row.es_local === 1) {
      match.equipoLocal = {
        id: row.id_equipo,
        nombre: row.nombre_equipo,
        logo: row.icon_equipo
      };
      match.goles_equipo_1 = row.goles_favor;
      match.goles_equipo_2 = row.goles_contra;
    } else {
      match.equipoVisitante = {
        id: row.id_equipo,
        nombre: row.nombre_equipo,
        logo: row.icon_equipo
      };
      match.goles_equipo_2 = row.goles_favor;
      match.goles_equipo_1 = row.goles_contra;
    }
  });
  
  const matchesArray = Array.from(matchesMap.values()).filter(m => m.equipoLocal && m.equipoVisitante);
  res.json(matchesArray);
});

// Crear o actualizar un partido
app.post('/matches', async (req, res) => {
  const match = req.body;
  console.log('[POST /matches] Datos recibidos:', match);

  // Validación básica de campos requeridos
  const requiredFields = [
    'id_partido', 'deporte', 'type_sport', 'id_equipo_local', 'id_equipo_visitante',
    'goles_equipo_1', 'goles_equipo_2', 'name_partido', 'name_cancha', 'fecha', 'hora'
  ];
  const missing = requiredFields.filter(f => match[f] === undefined || match[f] === null);

  if (missing.length > 0) {
    console.error('[POST /matches] Faltan campos requeridos:', missing);
    return res.status(400).json({ ok: false, error: 'Faltan campos requeridos', missing });
  }

  try {
    // Eliminar registros existentes del partido
    await db.run('DELETE FROM matches WHERE id_partido = ?', match.id_partido);

    // Insertar registro para equipo local
    await db.run(`INSERT INTO matches (
      id, id_partido, deporte, type_sport, id_equipo, nombre_equipo, icon_equipo, es_local, 
      goles_favor, goles_contra, estado, name_partido, name_cancha, fecha, hora
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      `${match.id_partido}_local`,
      match.id_partido,
      match.deporte,
      match.type_sport,
      match.id_equipo_local,
      match.equipoLocal?.nombre || '',
      match.icon_equipo_local,
      1,
      match.goles_equipo_1,
      match.goles_equipo_2,
      match.estado,
      match.name_partido,
      match.name_cancha,
      match.fecha,
      match.hora
    );

    // Insertar registro para equipo visitante
    await db.run(`INSERT INTO matches (
      id, id_partido, deporte, type_sport, id_equipo, nombre_equipo, icon_equipo, es_local, 
      goles_favor, goles_contra, estado, name_partido, name_cancha, fecha, hora
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      `${match.id_partido}_visitante`,
      match.id_partido,
      match.deporte,
      match.type_sport,
      match.id_equipo_visitante,
      match.equipoVisitante?.nombre || '',
      match.icon_equipo_visitante,
      0,
      match.goles_equipo_2,
      match.goles_equipo_1,
      match.estado,
      match.name_partido,
      match.name_cancha,
      match.fecha,
      match.hora
    );

    // Guardar todos los partidos en un archivo JSON para visualización
    const allMatches = await db.all('SELECT * FROM matches');
    const matchesFilePath = path.join(__dirname, '../data/matches.json');
    fs.writeFileSync(matchesFilePath, JSON.stringify(allMatches, null, 2), 'utf-8');
    console.log('[POST /matches] Partido creado/actualizado correctamente');
    res.json({ ok: true });
  } catch (err) {
    console.error('[POST /matches] Error al crear/actualizar partido:', err);
    res.status(500).json({ ok: false, error: 'Error al crear/actualizar partido', details: err.message });
  }
});

// Eliminar un partido
app.delete('/matches/:id', async (req, res) => {
  const { id } = req.params;
  console.log('[DELETE /matches/:id] id_partido recibido:', id);
  try {
    await db.run('DELETE FROM matches WHERE id_partido = ?', id);
    // Actualizar archivo de visualización tras el borrado
    const allMatches = await db.all('SELECT * FROM matches');
    const matchesFilePath = path.join(__dirname, '../data/matches.json');
    fs.writeFileSync(matchesFilePath, JSON.stringify(allMatches, null, 2), 'utf-8');
    console.log('[DELETE /matches/:id] Partido(s) borrado(s) correctamente');
    res.json({ ok: true });
  } catch (err) {
    console.error('[DELETE /matches/:id] Error al borrar partido:', err);
    res.status(500).json({ ok: false, error: 'Error al borrar partido', details: err.message });
  }
});

// Obtener todas las noticias
app.get('/news', async (req, res) => {
  const rows = await db.all('SELECT * FROM news ORDER BY id_noticia DESC');
  res.json(rows);
});

// Obtener una noticia por id
app.get('/news/:id', async (req, res) => {
  const { id } = req.params;
  const row = await db.get('SELECT * FROM news WHERE id_noticia = ?', id);
  if (row) {
    res.json(row);
  } else {
    res.status(404).json({ ok: false, error: 'Noticia no encontrada' });
  }
});

// Crear o actualizar una noticia
app.post('/news', async (req, res) => {
  const noticia = req.body;
  const requiredFields = ['id_noticia', 'title', 'subtitle', 'body', 'footer', 'img_portada'];
  const missing = requiredFields.filter(f => noticia[f] === undefined || noticia[f] === null);
  if (missing.length > 0) {
    return res.status(400).json({ ok: false, error: 'Faltan campos requeridos', missing });
  }
  try {
    await db.run(
      `INSERT OR REPLACE INTO news (id_noticia, title, subtitle, body, footer, img_portada)
       VALUES (?, ?, ?, ?, ?, ?)`,
      noticia.id_noticia,
      noticia.title,
      noticia.subtitle,
      noticia.body,
      noticia.footer,
      noticia.img_portada
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'Error al guardar noticia', details: err.message });
  }
});

// Eliminar una noticia
app.delete('/news/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.run('DELETE FROM news WHERE id_noticia = ?', id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'Error al borrar noticia', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend de standings escuchando en http://localhost:${PORT}`);
});
