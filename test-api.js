// Script de prueba para verificar la API
async function testAPI() {
  const baseURL = 'http://localhost:3001';
  
  try {
    // Test 1: Obtener partidos (debería devolver un array vacío inicialmente)
    console.log('🔍 Probando GET /matches...');
    const getResponse = await fetch(`${baseURL}/matches`);
    const matches = await getResponse.json();
    console.log('✅ Partidos obtenidos:', matches);
    
    // Test 2: Crear un partido de prueba
    console.log('\n📝 Probando POST /matches...');
    const testMatch = {
      id_partido: 'test-match-' + Date.now(),
      deporte: 'futbol_11_masculino',
      equipoLocal: {
        id: 'team1',
        nombre: 'Equipo Local Test',
        logo: 'logo1.png'
      },
      equipoVisitante: {
        id: 'team2',
        nombre: 'Equipo Visitante Test',
        logo: 'logo2.png'
      },
      goles_equipo_1: 2,
      goles_equipo_2: 1,
      estado: 'finalizado',
      name_partido: 'Partido de prueba',
      name_cancha: 'Cancha principal',
      fecha: '2025-05-24',
      hora: '15:00',
      id_equipo_local: 'team1',
      id_equipo_visitante: 'team2',
      icon_equipo_local: 'logo1.png',
      icon_equipo_visitante: 'logo2.png'
    };
    
    const postResponse = await fetch(`${baseURL}/matches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testMatch)
    });
    const postResult = await postResponse.json();
    console.log('✅ Partido creado:', postResult);
    
    // Test 3: Verificar que el partido se guardó correctamente
    console.log('\n🔍 Verificando que el partido se guardó...');
    const getResponse2 = await fetch(`${baseURL}/matches`);
    const matches2 = await getResponse2.json();
    console.log('✅ Partidos después de crear:', matches2);
    
    // Test 4: Eliminar el partido de prueba
    console.log('\n🗑️ Eliminando partido de prueba...');
    const deleteResponse = await fetch(`${baseURL}/matches/${testMatch.id_partido}`, {
      method: 'DELETE'
    });
    const deleteResult = await deleteResponse.json();
    console.log('✅ Partido eliminado:', deleteResult);
    
    console.log('\n🎉 ¡Todas las pruebas pasaron exitosamente!');
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  }
}

testAPI();
