const API_URL = 'http://localhost:3001';

export async function getStandings(sport: string) {
  const res = await fetch(`${API_URL}/standings/${sport}`);
  if (!res.ok) throw new Error('Error al obtener standings');
  return await res.json();
}

export async function saveStandings(sport: string, standings: any[]) {
  const res = await fetch(`${API_URL}/standings/${sport}` , {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(standings)
  });
  if (!res.ok) throw new Error('Error al guardar standings');
}
