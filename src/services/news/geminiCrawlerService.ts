
import { supabase } from '@/integrations/supabase/client';
import { NewsArticle } from '@/types';

/**
 * Trigger RSS article crawling with Gemini-enhanced summarization
 * @param topic - Topic to search for articles
 * @param limit - Number of articles to crawl (capped for cost optimization)
 * @param category - Category for the articles
 * @returns Promise with crawling result
 */
export const crawlArticlesWithGemini = async (
  topic: string = 'financial news',
  limit: number = 5,
  category: string = 'Business'
): Promise<{
  success: boolean;
  articles: NewsArticle[];
  message: string;
  costOptimizations?: {
    apiCallsUsed: number;
    duplicatesFiltered: number;
    recentArticlesFound: number;
    sourcesUsed?: string[];
  };
}> => {
  try {
    // Cap limit to control costs
    const optimizedLimit = Math.min(limit, 8);
    
    const { data, error } = await supabase.functions.invoke('gemini-article-crawler', {
      body: { topic, limit: optimizedLimit, category },
    });

    if (error) throw error;

    return {
      ...data,
      message: data.message + ` (RSS feeds with Gemini summarization)`
    };
  } catch (error) {
    console.error('Error crawling articles:', error);
    return {
      success: false,
      articles: [],
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Crawl economic news using RSS feeds with Gemini summarization
 */
export const crawlEconomicNews = async (limit: number = 10) => {
  return crawlArticlesWithGemini('economic news and market updates', limit, 'Economy');
};

/**
 * Crawl financial trends using RSS feeds with Gemini summarization
 */
export const crawlFinancialTrends = async (limit: number = 10) => {
  return crawlArticlesWithGemini('financial trends and investment insights', limit, 'Financial');
};

/**
 * Crawl business news using RSS feeds with Gemini summarization
 */
export const crawlBusinessNews = async (limit: number = 10) => {
  return crawlArticlesWithGemini('business news and corporate updates', limit, 'Business');
};

/**
 * Crawl cryptocurrency news using RSS feeds with Gemini summarization
 */
export const crawlCryptoNews = async (limit: number = 10) => {
  return crawlArticlesWithGemini('cryptocurrency and blockchain news', limit, 'Cryptocurrency');
};
