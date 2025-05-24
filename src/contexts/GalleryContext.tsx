import React, { createContext, useContext } from 'react';

const GalleryContext = createContext<null>(null);

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};

export const GalleryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <GalleryContext.Provider value={null}>
      {children}
    </GalleryContext.Provider>
  );
};