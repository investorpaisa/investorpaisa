
import { supabase } from '@/integrations/supabase/client';
import { NewsArticle } from '@/types';

/**
 * Trigger Gemini-powered article crawling
 * @param topic - Topic to search for articles
 * @param limit - Number of articles to crawl
 * @param category - Category for the articles
 * @returns Promise with crawling result
 */
export const crawlArticlesWithGemini = async (
  topic: string = 'financial news',
  limit: number = 10,
  category: string = 'Business'
): Promise<{
  success: boolean;
  articles: NewsArticle[];
  message: string;
}> => {
  try {
    const { data, error } = await supabase.functions.invoke('gemini-article-crawler', {
      body: { topic, limit, category },
    });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error crawling articles with Gemini:', error);
    return {
      success: false,
      articles: [],
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Crawl economic news using Gemini
 */
export const crawlEconomicNews = async (limit: number = 10) => {
  return crawlArticlesWithGemini('economic news and market updates', limit, 'Economy');
};

/**
 * Crawl financial trends using Gemini
 */
export const crawlFinancialTrends = async (limit: number = 10) => {
  return crawlArticlesWithGemini('financial trends and investment insights', limit, 'Financial');
};

/**
 * Crawl business news using Gemini
 */
export const crawlBusinessNews = async (limit: number = 10) => {
  return crawlArticlesWithGemini('business news and corporate updates', limit, 'Business');
};

/**
 * Crawl cryptocurrency news using Gemini
 */
export const crawlCryptoNews = async (limit: number = 10) => {
  return crawlArticlesWithGemini('cryptocurrency and blockchain news', limit, 'Cryptocurrency');
};
