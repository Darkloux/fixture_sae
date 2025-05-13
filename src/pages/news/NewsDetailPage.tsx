import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useNews } from '../../contexts/NewsContext';

const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getNewsById } = useNews();
  const news = id ? getNewsById(id) : null;

  useEffect(() => {
    if (news) {
      document.title = `${news.titulo} - Deportivo SAE`;
    }
  }, [news]);

  if (!news) {
    return (
      <div className="pt-24 pb-16">
        <div className="container-custom">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Noticia no encontrada</h1>
            <button
              onClick={() => navigate('/')}
              className="text-primary hover:underline flex items-center justify-center gap-2"
            >
              <ArrowLeft size={20} />
              Volver a noticias
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <article className="container-custom max-w-3xl">
        <button
          onClick={() => navigate('/')}
          className="text-primary hover:underline flex items-center gap-2 mb-4 text-sm md:text-base"
        >
          <ArrowLeft size={20} />
          Volver a noticias
        </button>

        <img
          src={news.portada}
          alt={news.titulo}
          className="w-full aspect-video object-cover rounded-lg shadow-md mb-6"
        />

        <div className="prose max-w-none">
          <h1 className="text-2xl md:text-3xl font-bold mb-3 text-dark">{news.titulo}</h1>
          
          <div className="flex items-center gap-4 text-gray-600 mb-4 text-sm">
            <time dateTime={news.fecha}>
              {new Date(news.fecha).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>

          {news.subtitulo && (
            <p className="text-base md:text-lg text-gray-600 mb-6 font-medium">
              {news.subtitulo}
            </p>
          )}

          <div 
            className="text-gray-800 leading-relaxed mb-6 text-sm md:text-base"
            dangerouslySetInnerHTML={{ __html: news.cuerpo }}
          />

          {news.pie && (
            <footer className="mt-6 pt-3 border-t border-gray-200 text-gray-600 italic text-sm">
              {news.pie}
            </footer>
          )}
        </div>
      </article>
    </div>
  );
};

export default NewsDetailPage;