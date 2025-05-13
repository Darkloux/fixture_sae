export interface GalleryItem {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: 'imagen' | 'video';
  url: string;
  fecha: string;
}

export interface GalleryContextType {
  items: GalleryItem[];
  addItem: (item: Omit<GalleryItem, 'id' | 'fecha'>) => void;
  updateItem: (id: string, item: Omit<GalleryItem, 'id' | 'fecha'>) => void;
  deleteItem: (id: string) => void;
  getItemById: (id: string) => GalleryItem | undefined;
  addMultimedia: (file: File) => Promise<{ url: string; tipo: 'imagen' | 'video' }>;
}