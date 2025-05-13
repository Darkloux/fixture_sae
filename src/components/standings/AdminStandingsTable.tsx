import React, { useState, useEffect } from 'react';
import { SportType, Team } from '../../types/sports';

interface AdminStandingsTableProps {
  standings: any[];
  columns: string[];
  onChange: (newStandings: any[]) => void;
}

const AdminStandingsTable: React.FC<AdminStandingsTableProps> = ({ standings, columns, onChange }) => {
  const [editRow, setEditRow] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  // Si la tabla cambia externamente, cerrar edición para evitar bugs
  useEffect(() => {
    setEditRow(null);
  }, [standings, columns]);

  const handleEdit = (id: string) => {
    setEditRow(id);
    setEditData(standings.find(s => s.id === id));
  };

  const handleChange = (col: string, value: string | number) => {
    setEditData((prev: any) => ({ ...prev, [col]: value }));
  };

  const handleSave = () => {
    const updated = standings.map(s =>
      s.id === editRow ? { ...editData, id: s.id, Equipo: s.Equipo } : s
    );
    onChange(updated);
    setEditRow(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-max w-full text-sm border-collapse">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col} className="px-3 py-2 bg-gray-100 border-b font-semibold text-gray-700 text-center whitespace-nowrap">
                {col}
              </th>
            ))}
            <th className="px-3 py-2 bg-gray-100 border-b"></th>
          </tr>
        </thead>
        <tbody>
          {standings.map((stats: any) => (
            <tr key={stats.id}>
              {columns.map(col => (
                <td key={col} className="px-3 py-2 border-b text-center whitespace-nowrap">
                  {editRow === stats.id && col !== 'Equipo' ? (
                    <input
                      type="number"
                      value={editData[col] ?? 0}
                      onChange={e => handleChange(col, Number(e.target.value))}
                      className="w-16 px-1 py-0.5 border rounded text-center"
                      step="any"
                    />
                  ) : (
                    <span>{stats[col] ?? 0}</span>
                  )}
                </td>
              ))}
              <td className="px-3 py-2 border-b text-center">
                {editRow === stats.id ? (
                  <button onClick={handleSave} className="text-green-600 font-bold">Guardar</button>
                ) : (
                  <button onClick={() => handleEdit(stats.id)} className="text-blue-600">Editar</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminStandingsTable;
