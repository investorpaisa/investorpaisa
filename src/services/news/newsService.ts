import { supabase } from '@/integrations/supabase/client';
import { NewsArticle } from '@/types';

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
    return data as NewsArticle[];
  } catch (error) {
    console.error('Error fetching latest news:', error);
    return [];
  }
};

/**
 * Get news articles by category
 * @param category - Category to filter by
 * @param limit - Number of articles to fetch
 * @returns Promise with news articles
 */
export const getNewsByCategory = async (category: string, limit = 10): Promise<NewsArticle[]> => {
  try {
    const { data, error } = await (supabase as any)
      .from('news_articles')
      .select()
      .eq('category', category)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as NewsArticle[];
  } catch (error) {
    console.error('Error fetching news by category:', error);
    return [];
  }
};

/**
 * Get top trending news articles by relevance score
 * @param limit - Number of articles to fetch
 * @returns Promise with news articles
 */
export const getTrendingNews = async (limit = 10): Promise<NewsArticle[]> => {
  try {
    const { data, error } = await (supabase as any)
      .from('news_articles')
      .select()
      .order('relevance_score', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as NewsArticle[];
  } catch (error) {
    console.error('Error fetching trending news:', error);
    return [];
  }
};

/**
 * Get economic news from NewsAPI and other sources
 * @param limit - Number of articles to fetch
 * @returns Promise with news articles
 */
export const getEconomicNews = async (limit = 10): Promise<NewsArticle[]> => {
  try {
    // First try to get from our database
    const { data, error } = await (supabase as any)
      .from('news_articles')
      .select()
      .eq('category', 'Economy')
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    // If we have enough data, return it
    if (data && data.length >= limit) {
      return data as NewsArticle[];
    }
    
    // Otherwise, fetch from edge function which will aggregate from external APIs
    const response = await supabase.functions.invoke('fetch-economic-news', {
      method: 'POST',
      body: JSON.stringify({ limit }),
    });
    
    if (response.error) throw response.error;
    return response.data || [];
  } catch (error) {
    console.error('Error fetching economic news:', error);
    return [];
  }
};

/**
 * Get financial trends from Alpha Vantage
 * @param limit - Number of articles to fetch
 * @returns Promise with news articles
 */
export const getFinancialTrends = async (limit = 10): Promise<NewsArticle[]> => {
  try {
    // First try to get from our database
    const { data, error } = await (supabase as any)
      .from('news_articles')
      .select()
      .eq('category', 'Financial')
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    // If we have enough data, return it
    if (data && data.length >= limit) {
      return data as NewsArticle[];
    }
    
    // Otherwise, fetch from edge function which will aggregate from external APIs
    const response = await supabase.functions.invoke('fetch-financial-trends', {
      method: 'POST',
      body: JSON.stringify({ limit }),
    });
    
    if (response.error) throw response.error;
    return response.data || [];
  } catch (error) {
    console.error('Error fetching financial trends:', error);
    return [];
  }
};

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

/**
 * Trigger news fetch via edge function
 * @returns Promise with result of fetch operation
 */
export const triggerNewsFetch = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-financial-news', {
      method: 'POST',
    });

    if (error) throw error;
    
    return {
      success: true,
      message: 'News fetched successfully'
    };
  } catch (error) {
    console.error('Error triggering news fetch:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
