
import { useState, useEffect } from 'react';
import { NewsArticle } from '@/types';
import { getLatestNews, getTrendingNews, getNewsByCategory, getEconomicNews, getFinancialTrends } from '@/services/news/newsService';

export const useNewsData = (limit: number = 5) => {
  const [latestNews, setLatestNews] = useState<NewsArticle[]>([]);
  const [trendingNews, setTrendingNews] = useState<NewsArticle[]>([]);
  const [businessNews, setBusinessNews] = useState<NewsArticle[]>([]);
  const [economicNews, setEconomicNews] = useState<NewsArticle[]>([]);
  const [financialTrends, setFinancialTrends] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllNews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [latest, trending, business, economic, financial] = await Promise.all([
          getLatestNews(limit),
          getTrendingNews(limit),
          getNewsByCategory('Business', limit),
          getEconomicNews(limit),
          getFinancialTrends(limit)
        ]);

        setLatestNews(latest);
        setTrendingNews(trending);
        setBusinessNews(business);
        setEconomicNews(economic);
        setFinancialTrends(financial);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to fetch news data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllNews();

    // Refresh news every 5 minutes
    const refreshInterval = setInterval(fetchAllNews, 5 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, [limit]);

  return {
    latestNews,
    trendingNews,
    businessNews,
    economicNews,
    financialTrends,
    isLoading,
    error
  };
};
