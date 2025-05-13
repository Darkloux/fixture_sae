# Backend básico para standings deportivos

Este backend usa Node.js, Express y SQLite para almacenar y servir la tabla de posiciones de cada deporte.

## Estructura
- /backend
  - db.sqlite (base de datos)
  - server.js (servidor Express)
  - package.json
  - README.md

## Endpoints principales
- GET /standings/:sport → Devuelve standings de un deporte
- POST /standings/:sport → Reemplaza standings de un deporte

## Uso rápido
1. Instala dependencias: npm install
2. Inicia el servidor: node server.js
3. El frontend puede consumir los endpoints en http://localhost:3001
