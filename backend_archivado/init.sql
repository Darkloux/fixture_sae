-- SQL para crear la tabla de standings
CREATE TABLE IF NOT EXISTS standings (
  id TEXT PRIMARY KEY,
  sport TEXT,
  equipo TEXT,
  puntos INTEGER,
  goles_favor INTEGER,
  goles_contra INTEGER,
  otros TEXT
);

-- SQL para crear la tabla de partidos (un registro por equipo participante)
CREATE TABLE IF NOT EXISTS matches (
  id TEXT PRIMARY KEY,
  id_partido TEXT,
  deporte TEXT,
  type_sport TEXT, -- Nuevo campo para el tipo de deporte
  id_equipo TEXT,
  nombre_equipo TEXT,
  icon_equipo TEXT,
  es_local INTEGER, -- 1 si es local, 0 si es visitante
  goles_favor INTEGER,
  goles_contra INTEGER,
  estado TEXT,
  name_partido TEXT,
  name_cancha TEXT,
  fecha TEXT,
  hora TEXT
);

-- SQL para crear la tabla de equipos
CREATE TABLE IF NOT EXISTS teams (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  logo TEXT,
  createdAt TEXT,
  updatedAt TEXT
);
