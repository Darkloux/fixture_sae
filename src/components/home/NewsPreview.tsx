import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

/**
 * Preview section for the latest news
 * Shows a few news items with links to the full news page
 */
const NewsPreview: React.FC = () => {
  // Sample news data (to be replaced with actual data in future)
  const newsList = [
    {
      id: 1,
      title: "Inscripciones abiertas para el Torneo Interfacultades",
      date: "10 mayo, 2025",
      excerpt: "Se invita a todos los estudiantes a participar en el tradicional torneo que reúne a las distintas facultades.",
      image: "https://images.pexels.com/photos/8828640/pexels-photo-8828640.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      id: 2,
      title: "Nuevos horarios para actividades deportivas",
      date: "5 mayo, 2025",
      excerpt: "Consulta los nuevos horarios de las distintas actividades deportivas disponibles para este semestre.",
      image: "https://images.pexels.com/photos/3755440/pexels-photo-3755440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      id: 3,
      title: "Equipo universitario clasifica a competencia nacional",
      date: "28 abril, 2025",
      excerpt: "Nuestro equipo de baloncesto logró clasificar a la fase final del campeonato nacional universitario.",
      image: "https://images.pexels.com/photos/1080884/pexels-photo-1080884.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Últimas Noticias</h2>
          <Link to="/noticias" className="text-primary flex items-center hover:underline">
            Ver todas <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsList.map((news) => (
            <div key={news.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img 
                src={news.image} 
                alt={news.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <p className="text-sm text-gray-500 mb-2">{news.date}</p>
                <h3 className="text-xl font-semibold mb-2">{news.title}</h3>
                <p className="text-gray-600 mb-4">{news.excerpt}</p>
                <Link to={`/noticias/${news.id}`} className="text-primary hover:underline">
                  Leer más
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsPreview;