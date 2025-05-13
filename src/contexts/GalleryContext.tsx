import React, { createContext, useContext, useState, useEffect } from 'react';
import { GalleryItem, GalleryContextType } from '../types/gallery';

const GalleryContext = createContext<GalleryContextType | null>(null);

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};

export const GalleryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<GalleryItem[]>([]);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const addMultimedia = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('El archivo no debe superar los 5MB');
    }

    const validImageTypes = ['image/jpeg', 'image/png'];
    const validVideoTypes = ['video/mp4'];
    const validTypes = [...validImageTypes, ...validVideoTypes];

    if (!validTypes.includes(file.type)) {
      throw new Error('Formato de archivo no soportado. Use JPG, PNG o MP4');
    }

    const base64 = await convertToBase64(file);
    const tipo = file.type.startsWith('image/') ? 'imagen' : 'video';

    return { url: base64, tipo };
  };

  useEffect(() => {
    const storedItems = localStorage.getItem('galeria');
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);

  const saveToLocalStorage = (updatedItems: GalleryItem[]) => {
    localStorage.setItem('galeria', JSON.stringify(updatedItems));
    setItems(updatedItems);
  };

  const addItem = (itemData: Omit<GalleryItem, 'id' | 'fecha'>) => {
    const newItem: GalleryItem = {
      ...itemData,
      id: `gallery-${Date.now()}`,
      fecha: new Date().toISOString(),
    };
    saveToLocalStorage([newItem, ...items]);
  };

  const updateItem = (id: string, itemData: Omit<GalleryItem, 'id' | 'fecha'>) => {
    const updatedItems = items.map((item) =>
      item.id === id
        ? { ...item, ...itemData }
        : item
    );
    saveToLocalStorage(updatedItems);
  };

  const deleteItem = (id: string) => {
    const filteredItems = items.filter((item) => item.id !== id);
    saveToLocalStorage(filteredItems);
  };

  const getItemById = (id: string) => {
    return items.find((item) => item.id === id);
  };

  return (
    <GalleryContext.Provider value={{ 
      items, 
      addItem, 
      updateItem, 
      deleteItem, 
      getItemById,
      addMultimedia 
    }}>
      {children}
    </GalleryContext.Provider>
  );
};