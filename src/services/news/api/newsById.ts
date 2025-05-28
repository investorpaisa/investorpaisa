
import { supabase } from '@/integrations/supabase/client';
import { NewsArticle } from '@/types';

/**
 * Get news article by ID
 * @param id - Article ID
 * @returns Promise with news article
 */
export const getNewsById = async (id: string): Promise<NewsArticle | null> => {
  try {
    const { data, error } = await (supabase as any)
      .from('news_articles')
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as NewsArticle;
  } catch (error) {
    console.error('Error fetching news by ID:', error);
    return null;
  }
};
