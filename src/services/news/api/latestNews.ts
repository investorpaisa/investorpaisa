
import { supabase } from '@/integrations/supabase/client';
import { NewsArticle } from '@/types';
import { getMockNews } from '../data/mockNews';

/**
 * Get latest news articles
 * @param limit - Number of articles to fetch
 * @returns Promise with news articles
 */
export const getLatestNews = async (limit = 10): Promise<NewsArticle[]> => {
  try {
    const { data, error } = await (supabase as any)
      .from('news_articles')
      .select()
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as NewsArticle[] || [];
  } catch (error) {
    console.error('Error fetching latest news:', error);
    return getMockNews(limit, 'Latest'); // Fallback to mock data if database query fails
  }
};
