// Test script para probar la API del backend
import fetch from 'node-fetch';
const API_URL = 'http://localhost:3001';

async function testBackend() {
  console.log('🔄 Probando la API del backend...\n');

  try {
    // 1. Probar obtener partidos (debería estar vacío inicialmente)
    console.log('1. Obteniendo partidos...');
    const matchesResponse = await fetch(`${API_URL}/matches`);
    const matches = await matchesResponse.json();
    console.log('✅ Partidos obtenidos:', matches.length);
    console.log(matches);

    // 2. Crear un partido de prueba
    console.log('\n2. Creando partido de prueba...');
    const testMatch = {
      id_partido: 'test-match-1',
      deporte: 'futbol_11_masculino',
      equipoLocal: {
        id: 'team1',
        nombre: 'Equipo Local',
        logo: 'logo1.png'
      },
      equipoVisitante: {
        id: 'team2',
        nombre: 'Equipo Visitante',
        logo: 'logo2.png'
      },
      goles_equipo_1: 2,
      goles_equipo_2: 1,
      estado: 'finalizado',
      name_partido: 'Cancha Principal',
      name_cancha: 'Stadium',
      fecha: '2025-05-24',
      hora: '15:00',
      id_equipo_local: 'team1',
      id_equipo_visitante: 'team2',
      icon_equipo_local: 'logo1.png',
      icon_equipo_visitante: 'logo2.png'
    };

    const createResponse = await fetch(`${API_URL}/matches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testMatch)
    });
    const createResult = await createResponse.json();
    console.log('✅ Partido creado:', createResult);

    // 3. Verificar que el partido se guardó correctamente
    console.log('\n3. Verificando partidos después de la creación...');
    const matchesResponse2 = await fetch(`${API_URL}/matches`);
    const matches2 = await matchesResponse2.json();
    console.log('✅ Partidos después de crear:', matches2.length);
    console.log(matches2);

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
}

testBackend();
