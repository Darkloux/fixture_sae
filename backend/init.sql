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
