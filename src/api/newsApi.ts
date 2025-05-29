import { supabase } from './supabaseClient';
import { News } from '../types/news';

export async function getNews(): Promise<News[]> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('fecha', { ascending: false });
  if (error) throw new Error('Error al obtener noticias: ' + error.message);
  return data as News[];
}

export async function getNewsById(id: string): Promise<News | null> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data as News;
}

export async function addNews(news: Omit<News, 'id' | 'fecha'>): Promise<void> {
  const newNews = {
    ...news,
    id: `news-${Date.now()}`,
    fecha: new Date().toISOString(),
  };
  const { error } = await supabase
    .from('news')
    .insert([newNews]);
  if (error) throw new Error('Error al agregar noticia: ' + error.message);
}

export async function updateNews(id: string, news: Omit<News, 'id' | 'fecha'>): Promise<void> {
  const { error } = await supabase
    .from('news')
    .update({ ...news })
    .eq('id', id);
  if (error) throw new Error('Error al actualizar noticia: ' + error.message);
}

export async function deleteNews(id: string): Promise<void> {
  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id);
  if (error) throw new Error('Error al borrar noticia: ' + error.message);
}
