import React, { useState } from 'react';
import { PlusCircle, Pencil, Trash2, X, Save } from 'lucide-react';
import { useNews } from '../../contexts/NewsContext';
import { News } from '../../types/news';

const NewsAdminPage: React.FC = () => {
  const { news, addNews, updateNews, deleteNews, addMultimedia } = useNews();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [preview, setPreview] = useState<string>('');
  const [formData, setFormData] = useState({
    titulo: '',
    subtitulo: '',
    cuerpo: '',
    pie: '',
    portada: '',
    multimedia: []
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isPortada: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError('');
      const base64 = await addMultimedia(file);
      
      if (isPortada) {
        setFormData(prev => ({ ...prev, portada: base64 }));
        setPreview(base64);
      } else {
        const mediaElement = file.type.startsWith('image/')
          ? `<img src="${base64}" alt="Imagen" class="max-w-full h-auto my-4" />`
          : `<video src="${base64}" controls class="max-w-full h-auto my-4"></video>`;
        
        setFormData(prev => ({
          ...prev,
          cuerpo: prev.cuerpo + '\n' + mediaElement
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el archivo');
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      subtitulo: '',
      cuerpo: '',
      pie: '',
      portada: '',
      multimedia: []
    });
    setPreview('');
    setError('');
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateNews(editingId, formData);
    } else {
      addNews(formData);
    }
    resetForm();
  };

  const handleEdit = (newsItem: News) => {
    setFormData({
      titulo: newsItem.titulo,
      subtitulo: newsItem.subtitulo,
      cuerpo: newsItem.cuerpo,
      pie: newsItem.pie,
      portada: newsItem.portada
    });
    setEditingId(newsItem.id);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    deleteNews(id);
    setShowConfirmDelete(null);
  };

  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Noticias</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn btn-primary flex items-center gap-2"
        >
          {isEditing ? (
            <>
              <X size={20} />
              Cancelar
            </>
          ) : (
            <>
              <PlusCircle size={20} />
              Nueva Noticia
            </>
          )}
        </button>
      </div>

      {isEditing && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subtítulo
            </label>
            <input
              type="text"
              value={formData.subtitulo}
              onChange={(e) => setFormData({ ...formData, subtitulo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagen de Portada
            </label>
            <div className="space-y-2">
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload(e, true)}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-white
                  hover:file:bg-primary-dark"
              />
              {preview && (
                <div className="mt-2">
                  <img src={preview} alt="Vista previa" className="max-h-40 rounded-md" />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cuerpo
            </label>
            <div className="mb-2">
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.mp4"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-white
                  hover:file:bg-primary-dark"
              />
              <p className="text-xs text-gray-500 mt-1">
                Formatos soportados: JPG, PNG, MP4. Máximo 5MB.
              </p>
            </div>
            <textarea
              value={formData.cuerpo}
              onChange={(e) => setFormData({ ...formData, cuerpo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md h-64 font-mono text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pie de Página
            </label>
            <input
              type="text"
              value={formData.pie}
              onChange={(e) => setFormData({ ...formData, pie: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={resetForm}
              className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary flex items-center gap-2">
              <Save size={20} />
              {editingId ? 'Actualizar' : 'Publicar'} Noticia
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <img
              src={item.portada}
              alt={item.titulo}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{item.titulo}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {new Date(item.fecha).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                >
                  <Pencil size={20} />
                </button>
                <button
                  onClick={() => setShowConfirmDelete(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showConfirmDelete === item.id && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                  <h4 className="text-lg font-semibold mb-4">Confirmar eliminación</h4>
                  <p className="text-gray-600 mb-6">
                    ¿Estás seguro de que deseas eliminar esta noticia? Esta acción no se puede deshacer.
                  </p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowConfirmDelete(null)}
                      className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="btn bg-red-600 text-white hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsAdminPage;