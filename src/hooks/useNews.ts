
import { useState, useEffect } from 'react';
import { NewsArticle } from '@/types';
import { getLatestNews, getTrendingNews, getNewsByCategory, triggerNewsFetch } from '@/services/news/newsService';

export const useNews = (category?: string, limit = 10, autoRefresh = false, refreshInterval = 10 * 60 * 1000) => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchNews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let result: NewsArticle[];
      
      if (category) {
        if (category === 'trending') {
          result = await getTrendingNews(limit);
        } else if (category === 'latest') {
          result = await getLatestNews(limit);
        } else {
          result = await getNewsByCategory(category, limit);
        }
      } else {
        result = await getLatestNews(limit);
      }
      
      setNews(result);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to fetch news. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshNews = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      // Trigger the crawler to fetch new content
      await triggerNewsFetch();
      // Then fetch the updated news
      await fetchNews();
    } catch (err) {
      console.error('Error refreshing news:', err);
      setError('Failed to refresh news. Please try again later.');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
    
    // Set up auto-refresh if enabled
    let intervalId: number | undefined;
    if (autoRefresh && refreshInterval > 0) {
      intervalId = setInterval(fetchNews, refreshInterval) as unknown as number;
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [category, limit, autoRefresh, refreshInterval]);

  return { news, isLoading, error, refreshNews, isRefreshing };
};
