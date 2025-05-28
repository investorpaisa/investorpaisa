
import { useState, useEffect } from 'react';
import { NewsArticle } from '@/types';
import { crawlArticlesWithGemini } from '@/services/news/geminiCrawlerService';
import { getNewsByCategory } from '@/services/news/newsService';

interface UseGeminiContentProps {
  topic: string;
  category: string;
  limit?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const useGeminiContent = ({
  topic,
  category,
  limit = 5,
  autoRefresh = false,
  refreshInterval = 10 * 60 * 1000 // 10 minutes
}: UseGeminiContentProps) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCrawling, setIsCrawling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExistingArticles = async () => {
    try {
      const existingArticles = await getNewsByCategory(category, limit);
      setArticles(existingArticles);
    } catch (err) {
      console.error('Error fetching existing articles:', err);
    }
  };

  const crawlNewContent = async () => {
    setIsCrawling(true);
    try {
      const result = await crawlArticlesWithGemini(topic, limit, category);
      if (result.success) {
        // Refresh articles after crawling
        await fetchExistingArticles();
      }
    } catch (err) {
      console.error('Error crawling content:', err);
      setError('Failed to generate new content');
    } finally {
      setIsCrawling(false);
    }
  };

  const loadContent = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First, try to get existing articles
      await fetchExistingArticles();
      
      // If we have very few articles, crawl new content
      const existingArticles = await getNewsByCategory(category, limit);
      if (existingArticles.length < Math.max(2, limit / 2)) {
        await crawlNewContent();
      }
    } catch (err) {
      console.error('Error loading content:', err);
      setError('Failed to load content');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
    
    // Set up auto-refresh if enabled
    let intervalId: number | undefined;
    if (autoRefresh && refreshInterval > 0) {
      intervalId = setInterval(loadContent, refreshInterval) as unknown as number;
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [topic, category, limit]);

  return {
    articles,
    isLoading,
    isCrawling,
    error,
    refreshContent: loadContent,
    crawlNewContent
  };
};
