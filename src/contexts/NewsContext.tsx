import React, { createContext, useContext, useState, useEffect } from 'react';
import { News, NewsContextType } from '../types/news';
import { getNews, addNews as addNewsApi, updateNews as updateNewsApi, deleteNews as deleteNewsApi } from '../api/newsApi';

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
    getNews().then(setNews);
  }, []);

  const addNews = async (newsData: Omit<News, 'id' | 'fecha'>) => {
    await addNewsApi(newsData);
    setNews(await getNews());
  };

  const updateNews = async (id: string, newsData: Omit<News, 'id' | 'fecha'>) => {
    await updateNewsApi(id, newsData);
    setNews(await getNews());
  };

  const deleteNews = async (id: string) => {
    await deleteNewsApi(id);
    setNews(await getNews());
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