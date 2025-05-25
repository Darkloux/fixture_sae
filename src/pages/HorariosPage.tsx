import React from 'react';

const HorariosPage: React.FC = () => {
  return (
    <div className="pt-24 pb-16">
      <div className="container-custom max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-primary">Horarios</h1>
        <p className="mb-4 text-gray-700">Consulta los horarios de las actividades deportivas de las Olimpiadas 2025.</p>
        <ul className="space-y-4">
          <li className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between">
            <span className="font-semibold text-lg">Básquet</span>
            <span className="text-gray-600">Lunes y Miércoles - 18:00 a 20:00 (Complejo Avellaneda)</span>
          </li>
          <li className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between">
            <span className="font-semibold text-lg">Vóley</span>
            <span className="text-gray-600">Martes y Jueves - 19:00 a 21:00 (Complejo Dickens)</span>
          </li>
          <li className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between">
            <span className="font-semibold text-lg">Fútbol</span>
            <span className="text-gray-600">Viernes - 17:00 a 19:00 (Cancha Central)</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HorariosPage;
