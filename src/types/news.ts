export interface News {
  id: string;
  titulo: string;
  subtitulo: string;
  cuerpo: string;
  pie: string;
  portada: string;
  fecha: string;
  multimedia: {
    tipo: 'imagen' | 'video';
    url: string;
  }[];
}

export interface NewsContextType {
  news: News[];
  addNews: (news: Omit<News, 'id' | 'fecha'>) => void;
  updateNews: (id: string, news: Omit<News, 'id' | 'fecha'>) => void;
  deleteNews: (id: string) => void;
  getNewsById: (id: string) => News | undefined;
  addMultimedia: (file: File) => Promise<string>;
}