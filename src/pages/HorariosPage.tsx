import React, { useState } from 'react';
import { SportType } from '../types/sports';

// Fuente real de disciplinas (idéntica a StatsPage y FixtureAdminPage)
const deportes: { id: SportType; nombre: string }[] = [
  { id: 'futbol_11_masculino', nombre: 'Fútbol 11 masculino' },
  { id: 'futbol_7_femenino', nombre: 'Fútbol 7 femenino' },
  { id: 'futbol_5_masculino', nombre: 'Fútbol 5 masculino' },
  { id: 'basquet_5x5_masculino', nombre: 'Basquet 5x5 masculino' },
  { id: 'basquet_5x5_femenino', nombre: 'Basquet 5x5 femenino' },
  { id: 'voley_masculino', nombre: 'Voley masculino' },
  { id: 'voley_femenino', nombre: 'Voley femenino' },
];

const HorariosPage: React.FC = () => {
  const [selectedSport, setSelectedSport] = useState<string>('');

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-primary">Horarios</h1>
        <p className="mb-4 text-gray-700">Consulta los horarios de las actividades deportivas de las Olimpiadas 2025.</p>
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:gap-4 gap-2">
          <label htmlFor="deporte" className="font-medium text-gray-700">Disciplina:</label>
          <select
            id="deporte"
            value={selectedSport}
            onChange={e => setSelectedSport(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">Selecciona una disciplina</option>
            {deportes.map(d => (
              <option key={d.id} value={d.id}>{d.nombre}</option>
            ))}
          </select>
        </div>
        {selectedSport === 'futbol_7_femenino' ? (
          <div className="bg-white rounded-lg shadow p-8 text-gray-700 text-lg font-semibold space-y-6">
            <div>
              <span className="block text-primary text-xl font-bold mb-2">📅 Miércoles 28</span>
              <span className="block font-bold mb-1">1ERA FECHA</span>
              <span className="block mb-1">09:30 hs</span>
              <div className="mb-2">
                <span className="block">Cancha 1: UTN 🆚 UNT</span>
                <span className="block">Cancha 2: IPEF A 🆚 IPEF B</span>
              </div>
              <span className="block font-bold mb-1">2DA FECHA</span>
              <span className="block mb-1">12:00 hs</span>
              <div>
                <span className="block">Cancha 1: UNT 🆚 IPEF B</span>
                <span className="block">Cancha 2: UTN 🆚 IPEF A</span>
              </div>
            </div>
            <div>
              <span className="block text-primary text-xl font-bold mb-2">📅 Jueves 29</span>
              <span className="block font-bold mb-1">3RA FECHA</span>
              <span className="block mb-1">09:00 hs</span>
              <div className="mb-2">
                <span className="block">Cancha 1: IPEF A 🆚 UNT</span>
                <span className="block">Cancha 2: IPEF B 🆚 UTN</span>
              </div>
              <span className="block font-bold mb-1">⚽ ELIMINATORIAS - SEMIFINALES</span>
              <span className="block mb-1">12:00 hs</span>
              <div>
                <span className="block">Cancha 1: 1.º Puesto 🆚 4.º Puesto (Llave 1)</span>
                <span className="block">Cancha 2: 2.º Puesto 🆚 3.º Puesto (Llave 2)</span>
              </div>
            </div>
            <div>
              <span className="block text-primary text-xl font-bold mb-2">📅 Viernes 30</span>
              <span className="block font-bold mb-1">🥉 3ER PUESTO</span>
              <span className="block mb-1">09:00 hs</span>
              <div className="mb-2">
                <span className="block">Cancha 1: Perdedor Llave 1 🆚 Perdedor Llave 2</span>
              </div>
              <span className="block font-bold mb-1">🏆 FINAL</span>
              <span className="block mb-1">12:00 hs</span>
              <div className="mb-2">
                <span className="block">Cancha 1: Ganador Llave 1 🆚 Ganador Llave 2</span>
              </div>
              <span className="block font-bold mb-1">🏅 GANADOR</span>
              <span className="block text-sm text-gray-500">(Espacio reservado para escribir al campeón del torneo)</span>
            </div>
          </div>
        ) : selectedSport === 'futbol_11_masculino' ? (
          <div className="bg-white rounded-lg shadow p-8 text-gray-700 text-lg font-semibold space-y-6">
            <div>
              <span className="block text-primary text-xl font-bold mb-2">📅 Miércoles 28</span>
              <span className="block font-bold mb-1">1ERA FECHA</span>
              <span className="block mb-1">09:30 hs</span>
              <div className="mb-2">
                <span className="block">Cancha 1: IPEF 🆚 USPT</span>
                <span className="block">Cancha 2: UNT 🆚 UTN</span>
              </div>
              <span className="block font-bold mb-1">2DA FECHA</span>
              <span className="block mb-1">12:30 hs</span>
              <div>
                <span className="block">Cancha 1: IPEF 🆚 UTN</span>
                <span className="block">Cancha 2: USPT 🆚 UNT</span>
              </div>
            </div>
            <div>
              <span className="block text-primary text-xl font-bold mb-2">📅 Jueves 29</span>
              <span className="block font-bold mb-1">3RA FECHA</span>
              <span className="block mb-1">09:00 hs</span>
              <div className="mb-2">
                <span className="block">Cancha 1: IPEF 🆚 UNT</span>
                <span className="block">Cancha 2: UTN 🆚 USPT</span>
              </div>
              <span className="block font-bold mb-1">⚽ ELIMINATORIAS - SEMIFINALES</span>
              <span className="block mb-1">12:00 hs</span>
              <div>
                <span className="block">Cancha 1: 1.º Puesto 🆚 4.º Puesto (Llave 1)</span>
                <span className="block">Cancha 2: 2.º Puesto 🆚 3.º Puesto (Llave 2)</span>
              </div>
            </div>
            <div>
              <span className="block text-primary text-xl font-bold mb-2">📅 Viernes 30</span>
              <span className="block font-bold mb-1">🥉 3ER PUESTO</span>
              <span className="block mb-1">09:00 hs</span>
              <div className="mb-2">
                <span className="block">Cancha 1: Perdedor Llave 1 🆚 Perdedor Llave 2</span>
              </div>
              <span className="block font-bold mb-1">🏆 FINAL</span>
              <span className="block mb-1">12:30 hs</span>
              <div className="mb-2">
                <span className="block">Cancha 1: Ganador Llave 1 🆚 Ganador Llave 2</span>
              </div>
              <span className="block font-bold mb-1">🏅 GANADOR</span>
              <span className="block text-sm text-gray-500">(Espacio reservado para escribir al campeón del torneo)</span>
            </div>
          </div>
        ) : selectedSport === 'futbol_5_masculino' ? (
          <div className="bg-white rounded-lg shadow p-8 text-gray-700 text-lg font-semibold space-y-6">
            <div>
              <span className="block text-primary text-xl font-bold mb-2">📅 Miércoles 28</span>
              <span className="block font-bold mb-1">1ERA FECHA</span>
              <span className="block mb-1">09:30 hs</span>
              <div className="mb-2">
                <span className="block">Cancha 1: UTN 🆚 UNT</span>
                <span className="block">Cancha 2: IPEF 🆚 USPT</span>
              </div>
              <span className="block font-bold mb-1">2DA FECHA</span>
              <span className="block mb-1">12:00 hs</span>
              <div>
                <span className="block">Cancha 1: UNT 🆚 IPEF</span>
                <span className="block">Cancha 2: UTN 🆚 USPT</span>
              </div>
            </div>
            <div>
              <span className="block text-primary text-xl font-bold mb-2">📅 Jueves 29</span>
              <span className="block font-bold mb-1">3RA FECHA</span>
              <span className="block mb-1">09:00 hs</span>
              <div className="mb-2">
                <span className="block">Cancha 1: IPEF 🆚 UTN</span>
                <span className="block">Cancha 2: UNT 🆚 USPT</span>
              </div>
              <span className="block font-bold mb-1">⚽ ELIMINATORIAS - SEMIFINALES</span>
              <span className="block mb-1">12:00 hs</span>
              <div>
                <span className="block">Cancha 1: 1.º Puesto 🆚 4.º Puesto (Llave 1)</span>
                <span className="block">Cancha 2: 2.º Puesto 🆚 3.º Puesto (Llave 2)</span>
              </div>
            </div>
            <div>
              <span className="block text-primary text-xl font-bold mb-2">📅 Viernes 30</span>
              <span className="block font-bold mb-1">🥉 3ER PUESTO</span>
              <span className="block mb-1">09:00 hs</span>
              <div className="mb-2">
                <span className="block">Cancha 1: Perdedor Llave 1 🆚 Perdedor Llave 2</span>
              </div>
              <span className="block font-bold mb-1">🏆 FINAL</span>
              <span className="block mb-1">12:00 hs</span>
              <div className="mb-2">
                <span className="block">Cancha 1: Ganador Llave 1 🆚 Ganador Llave 2</span>
              </div>
              <span className="block font-bold mb-1">🏅 GANADOR</span>
              <span className="block text-sm text-gray-500">(Espacio reservado para escribir al campeón del torneo)</span>
            </div>
          </div>
        ) : selectedSport === 'basquet_5x5_masculino' ? (
          <div className="bg-white rounded-lg shadow p-8 text-gray-700 text-lg font-semibold space-y-6">
            <div>
              <span className="block text-primary text-xl font-bold mb-2">📅 MIÉRCOLES 28 DE MAYO</span>
              <span className="block mb-1">08:00 hs</span>
              <div className="mb-2">
                <span className="block">IPEF ANEXO 🆚 IPEF CENTRO</span>
              </div>
              <span className="block mb-1">10:30 hs</span>
              <div className="mb-2">
                <span className="block">UNT 🆚 UTN</span>
              </div>
            </div>
            <div>
              <span className="block text-primary text-xl font-bold mb-2">📅 JUEVES 29 DE MAYO</span>
              <span className="block mb-1">08:00 hs</span>
              <div className="mb-2">
                <span className="block">IPEF ANEXO 🆚 UTN</span>
              </div>
              <span className="block mb-1">10:30 hs</span>
              <div className="mb-2">
                <span className="block">IPEF CENTRO 🆚 UNT</span>
              </div>
            </div>
            <div>
              <span className="block text-primary text-xl font-bold mb-2">📅 VIERNES 30 DE MAYO</span>
              <span className="block mb-1">08:00 hs</span>
              <div className="mb-2">
                <span className="block">IPEF CENTRO 🆚 UTN</span>
              </div>
              <span className="block mb-1">10:30 hs</span>
              <div className="mb-2">
                <span className="block">IPEF ANEXO 🆚 UNT</span>
              </div>
            </div>
          </div>
        ) : selectedSport === 'basquet_5x5_femenino' ? (
          <div className="bg-white rounded-lg shadow p-8 text-gray-700 text-lg font-semibold space-y-6">
            <div>
              <span className="block text-primary text-xl font-bold mb-2">📅 MIÉRCOLES 28 DE MAYO</span>
              <span className="block mb-1">09:20 hs</span>
              <div className="mb-2">
                <span className="block">UTN 🆚 UNT</span>
              </div>
            </div>
            <div>
              <span className="block text-primary text-xl font-bold mb-2">📅 JUEVES 29 DE MAYO</span>
              <span className="block mb-1">09:20 hs</span>
              <div className="mb-2">
                <span className="block">UNT 🆚 IPEF</span>
              </div>
            </div>
            <div>
              <span className="block text-primary text-xl font-bold mb-2">📅 VIERNES 30 DE MAYO</span>
              <span className="block mb-1">09:20 hs</span>
              <div className="mb-2">
                <span className="block">IPEF 🆚 UNT</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500 text-lg font-semibold">
            Sin horarios
          </div>
        )}
      </div>
    </div>
  );
};

export default HorariosPage;
