import React, { createContext, useContext, useState, useEffect } from 'react';
import { News, NewsContextType } from '../types/news';

const NewsContext = createContext<NewsContextType | null>(null);

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [news, setNews] = useState<News[]>([]);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const addMultimedia = async (file: File): Promise<string> => {
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('El archivo no debe superar los 5MB');
    }

    const validImageTypes = ['image/jpeg', 'image/png'];
    const validVideoTypes = ['video/mp4'];
    const validTypes = [...validImageTypes, ...validVideoTypes];

    if (!validTypes.includes(file.type)) {
      throw new Error('Formato de archivo no soportado. Use JPG, PNG o MP4');
    }

    return await convertToBase64(file);
  };

  useEffect(() => {
    const storedNews = localStorage.getItem('noticias');
    if (storedNews) {
      setNews(JSON.parse(storedNews));
    }
  }, []);

  const saveToLocalStorage = (updatedNews: News[]) => {
    localStorage.setItem('noticias', JSON.stringify(updatedNews));
    setNews(updatedNews);
  };

  const addNews = (newsData: Omit<News, 'id' | 'fecha'>) => {
    const newNews: News = {
      ...newsData,
      id: `news-${Date.now()}`,
      fecha: new Date().toISOString(),
    };
    saveToLocalStorage([newNews, ...news]);
  };

  const updateNews = (id: string, newsData: Omit<News, 'id' | 'fecha'>) => {
    const updatedNews = news.map((item) =>
      item.id === id
        ? { ...item, ...newsData }
        : item
    );
    saveToLocalStorage(updatedNews);
  };

  const deleteNews = (id: string) => {
    const filteredNews = news.filter((item) => item.id !== id);
    saveToLocalStorage(filteredNews);
  };

  const getNewsById = (id: string) => {
    return news.find((item) => item.id === id);
  };

  return (
    <NewsContext.Provider value={{ news, addNews, updateNews, deleteNews, getNewsById, addMultimedia }}>
      {children}
    </NewsContext.Provider>
  );
};