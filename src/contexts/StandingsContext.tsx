import React, { createContext, useContext, useState, useEffect } from 'react';
import { SportType } from '../types/sports';
import { getStandings, saveStandings } from '../api/standingsApi';

interface StandingsContextType {
  customStandings: Partial<Record<SportType, any[]>>;
  setCustomStandings: React.Dispatch<React.SetStateAction<Partial<Record<SportType, any[]>>>>;
}

const StandingsContext = createContext<StandingsContextType | undefined>(undefined);

export const StandingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customStandings, setCustomStandings] = useState<Partial<Record<SportType, any[]>>>({});

  // Cargar standings desde backend al iniciar
  useEffect(() => {
    const deportes: SportType[] = [
      'futbol_11_masculino',
      'futbol_7_femenino',
      'futbol_5_masculino',
      'basquet_5x5_masculino',
      'basquet_5x5_femenino',
      'voley_masculino',
      'voley_femenino',
    ];
    deportes.forEach(async (sport) => {
      try {
        const data = await getStandings(sport);
        setCustomStandings(prev => ({ ...prev, [sport]: data }));
      } catch {}
    });
  }, []);

  // Guardar standings en backend cuando cambian
  const setAndSaveCustomStandings = (updater: any) => {
    setCustomStandings(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      Object.entries(next).forEach(([sport, standings]) => {
        const arr = Array.isArray(standings) ? standings : [];
        const mapped = arr.map((row: any) => ({
          id: row.id,
          equipo: row.Equipo,
          puntos: row.PTS ?? row.Puntos ?? row.puntos ?? 0,
          goles_favor: row.GF ?? row.PF ?? row.SG ?? 0,
          goles_contra: row.GC ?? row.PC ?? row.SC ?? 0,
          partidos_jugados: row.PJ ?? 0,
          partidos_ganados: row.PG ?? 0,
          partidos_perdidos: row.PP ?? 0,
          partidos_empatados: row.PE ?? 0,
          otros: JSON.stringify(row)
        }));
        saveStandings(sport, mapped);
      });
      return next;
    });
  };

  return (
    <StandingsContext.Provider value={{ customStandings, setCustomStandings: setAndSaveCustomStandings }}>
      {children}
    </StandingsContext.Provider>
  );
};

export const useStandings = () => {
  const context = useContext(StandingsContext);
  if (!context) throw new Error('useStandings debe usarse dentro de StandingsProvider');
  return context;
};
