import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';
import { useNews } from '../../contexts/NewsContext';

const NewsListPage: React.FC = () => {
  const { news } = useNews();

  useEffect(() => {
    document.title = 'SAE UTN - Noticias';
  }, []);

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Noticia principal destacada */}
          <div className="mb-8 p-6 bg-primary/10 border-l-4 border-primary rounded-lg shadow">
            <h2 className="font-extrabold text-xl md:text-2xl text-primary leading-tight uppercase mb-2">
              2° OLIMPIADAS DEPORTIVAS DE EDUCACIÓN SUPERIOR DE TUCUMÁN
            </h2>
            <p className="text-sm md:text-base text-dark mb-2">
              El comité organizador de las Olimpiadas Deportivas de Educación Superior de Tucumán 2025, tiene el agrado de invitarle al acto de lanzamiento el día 6 de Mayo.
            </p>
            <div className="text-sm md:text-base text-dark flex flex-wrap gap-4">
              <span>📅 <b>MARTES 06/05</b></span>
              <span>🏫 <b>AULA MAGNA - UTN TUC</b></span>
              <span>📍 <b>Rivadavia 1050 - San Miguel de Tucumán</b></span>
              <span>🕖 <b>19:00 HS</b></span>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Últimas Noticias</h1>
          <p className="text-gray-600 mb-8">Mantente informado sobre las últimas novedades deportivas</p>
          
          <div className="space-y-6">
            {news.map((item) => (
              <Link 
                key={item.id}
                to={`/noticias/${item.id}`}
                className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <article className="flex flex-col md:flex-row">
                  <div className="md:w-1/3">
                    <img 
                      src={item.portada} 
                      alt={item.titulo}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <Calendar size={16} />
                      {new Date(item.fecha).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <h2 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {item.titulo}
                    </h2>
                    <p className="text-gray-600 line-clamp-2 mb-4">
                      {item.subtitulo}
                    </p>
                    <span className="inline-flex items-center text-primary text-sm font-medium hover:underline">
                      Leer más <ChevronRight size={16} className="ml-1" />
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>

        {news.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No hay noticias disponibles en este momento.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsListPage;