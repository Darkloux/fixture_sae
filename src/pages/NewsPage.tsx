import React, { useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

/**
 * News page component
 * Placeholder for future news section implementation
 */
const NewsPage: React.FC = () => {
  // Update the document title when the component mounts
  useEffect(() => {
    document.title = 'Deportivo SAE - Secretaría de Asuntos Estudiantiles';
  }, []);

  // Sample news data (to be replaced with actual data in future)
  const newsList = [
    {
      id: 1,
      title: "Inscripciones abiertas para el Torneo Interfacultades",
      date: "10 mayo, 2025",
      content: "Se invita a todos los estudiantes a participar en el tradicional torneo que reúne a las distintas facultades. Las inscripciones permanecerán abiertas hasta el 25 de mayo. Los interesados pueden acercarse a la oficina de la Secretaría de Deportes para más información.",
      image: "https://images.pexels.com/photos/8828640/pexels-photo-8828640.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      id: 2,
      title: "Nuevos horarios para actividades deportivas",
      date: "5 mayo, 2025",
      content: "Consulta los nuevos horarios de las distintas actividades deportivas disponibles para este semestre. Se han incorporado nuevas disciplinas y ampliado los horarios para facilitar la participación de todos los estudiantes.",
      image: "https://images.pexels.com/photos/3755440/pexels-photo-3755440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      id: 3,
      title: "Equipo universitario clasifica a competencia nacional",
      date: "28 abril, 2025",
      content: "Nuestro equipo de baloncesto logró clasificar a la fase final del campeonato nacional universitario. Tras una destacada participación en las eliminatorias regionales, el equipo disputará el título nacional en junio próximo.",
      image: "https://images.pexels.com/photos/1080884/pexels-photo-1080884.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      id: 4,
      title: "Inauguración de nuevas instalaciones deportivas",
      date: "15 abril, 2025",
      content: "La universidad ha inaugurado nuevas instalaciones deportivas que incluyen una piscina semiolímpica y un gimnasio equipado con tecnología de última generación. Estas mejoras buscan potenciar el desarrollo deportivo de nuestros estudiantes.",
      image: "https://images.pexels.com/photos/260352/pexels-photo-260352.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      id: 5,
      title: "Convocatoria para los Juegos Universitarios",
      date: "2 abril, 2025",
      content: "Se convoca a todos los estudiantes interesados en formar parte de las delegaciones que representarán a nuestra universidad en los Juegos Universitarios. Las pruebas de selección se realizarán durante las próximas dos semanas.",
      image: "https://images.pexels.com/photos/163444/sport-treadmill-tor-route-163444.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }
  ];

  return (
    <div className="pt-20 pb-16"> {/* Reduced top padding */}
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold">Secretaría de Asuntos Estudiantiles</h1>
          <p className="text-gray-600 text-sm">
            Mantente informado sobre las últimas novedades, actividades y eventos estudiantiles.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {newsList.map((news) => (
            <article 
              key={news.id} 
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
            >
              <img 
                src={news.image} 
                alt={news.title} 
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4 flex flex-col flex-grow">
                <p className="text-xs text-gray-500 mb-2">{news.date}</p>
                <h2 className="text-lg font-semibold mb-2 line-clamp-2 hover:text-primary transition-colors">
                  {news.title}
                </h2>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {news.content}
                </p>
                <a 
                  href="#" 
                  className="mt-auto text-sm text-primary flex items-center hover:underline"
                >
                  Leer más <ChevronRight size={14} className="ml-1" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;