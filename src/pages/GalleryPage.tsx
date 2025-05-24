import React, { useEffect, useState } from 'react';
import { useGallery } from '../contexts/GalleryContext';
import { Play } from 'lucide-react';
import { GalleryItem } from '../types/gallery';

const GalleryPage: React.FC = () => {
  const { items }: { items: GalleryItem[] } = useGallery();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Deportivo SAE - Galería';
  }, []);

  return (
    <div className="pt-24 pb-16"> {/* Padding to account for fixed navbar */}
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Galería de Imágenes</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Momentos destacados de nuestras actividades deportivas y eventos universitarios.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div 
              key={item.id}
              onClick={() => setSelectedItem(item.id)} 
              className="group cursor-pointer bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="relative aspect-video">
                {item.tipo === 'imagen' ? (
                  <img 
                    src={item.url} 
                    alt={item.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="relative w-full h-full bg-gray-900">
                    <video 
                      src={item.url}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play size={48} className="text-white opacity-70 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{item.titulo}</h3>
                <p className="text-gray-600 text-sm">{item.descripcion}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for viewing selected item */}
        {selectedItem && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <div className="max-w-4xl w-full max-h-[90vh] overflow-auto">
              {items.find(item => item.id === selectedItem)?.tipo === 'imagen' ? (
                <img
                  src={items.find(item => item.id === selectedItem)?.url}
                  alt={items.find(item => item.id === selectedItem)?.titulo}
                  className="w-full h-auto"
                />
              ) : (
                <video
                  src={items.find(item => item.id === selectedItem)?.url}
                  controls
                  autoPlay
                  className="w-full h-auto"
                />
              )}
            </div>
          </div>
        )}

        {items.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No hay contenido disponible en la galería.
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;