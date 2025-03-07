
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { NewsArticle } from '@/types';

export const newsService = {
  /**
   * Get all news articles
   */
  async getAllNews(): Promise<NewsArticle[]> {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting news articles:', error);
      return [];
    }
  },

  /**
   * Get trending news articles
   */
  async getTrendingNews(): Promise<NewsArticle[]> {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('relevance_score', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting trending news:', error);
      return [];
    }
  },

  /**
   * Get news articles by category
   */
  async getNewsByCategory(category: string): Promise<NewsArticle[]> {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('category', category)
        .order('published_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error getting ${category} news:`, error);
      return [];
    }
  },

  /**
   * Search news articles
   */
  async searchNews(query: string): Promise<NewsArticle[]> {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .or(`title.ilike.%${query}%,summary.ilike.%${query}%`)
        .order('published_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching news:', error);
      return [];
    }
  }
};
