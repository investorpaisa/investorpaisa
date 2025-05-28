
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
    return data as NewsArticle[] || [];
  } catch (error) {
    console.error('Error fetching latest news:', error);
    return getMockNews(limit, 'Latest'); // Fallback to mock data if database query fails
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
    return data as NewsArticle[] || [];
  } catch (error) {
    console.error('Error fetching news by category:', error);
    return getMockNews(limit, category); // Fallback to mock data if database query fails
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
    return data as NewsArticle[] || [];
  } catch (error) {
    console.error('Error fetching trending news:', error);
    return getMockNews(limit, 'Trending'); // Fallback to mock data if database query fails
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
    return response.data as NewsArticle[] || getMockNews(limit, 'Economy');
  } catch (error) {
    console.error('Error fetching economic news:', error);
    return getMockNews(limit, 'Economy'); // Fallback to mock data if API calls fail
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
    return response.data as NewsArticle[] || getMockNews(limit, 'Financial');
  } catch (error) {
    console.error('Error fetching financial trends:', error);
    return getMockNews(limit, 'Financial'); // Fallback to mock data if API calls fail
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
 * Trigger news fetch via edge function or Gemini crawler
 * @returns Promise with result of fetch operation
 */
export const triggerNewsFetch = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    // Try Gemini crawler first for more diverse content
    const geminiResponse = await supabase.functions.invoke('gemini-article-crawler', {
      body: { topic: 'latest financial and economic news', limit: 5, category: 'Business' },
    });

    if (!geminiResponse.error) {
      return {
        success: true,
        message: 'News fetched successfully using Gemini AI'
      };
    }

    // Fallback to traditional news fetch
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

// Helper function to generate mock news data when API calls fail
const getMockNews = (limit: number, category: string): NewsArticle[] => {
  const mockNews: Record<string, NewsArticle[]> = {
    Latest: [
      {
        id: 'mock-latest-1',
        title: 'Global Markets Rally as Inflation Concerns Ease',
        summary: 'Markets across the globe surged today as new data suggests inflation pressures are beginning to ease, potentially setting the stage for central banks to reconsider their interest rate strategies.',
        url: 'https://example.com/markets-rally',
        source: 'Financial Times',
        category: 'Markets',
        published_at: new Date().toISOString(),
        thumbnail_url: 'https://placehold.co/600x400?text=Financial+News',
        relevance_score: 95
      },
      {
        id: 'mock-latest-2',
        title: 'Tech Giants Report Strong Quarterly Earnings',
        summary: 'Major technology companies exceeded analyst expectations in their latest earnings reports, driving market optimism about the sector\'s continued growth potential.',
        url: 'https://example.com/tech-earnings',
        source: 'CNBC',
        category: 'Earnings',
        published_at: new Date(Date.now() - 3600000).toISOString(),
        thumbnail_url: 'https://placehold.co/600x400?text=Tech+News',
        relevance_score: 90
      }
    ],
    Trending: [
      {
        id: 'mock-trending-1',
        title: 'Cryptocurrency Market Sees Major Shift as Regulations Tighten',
        summary: 'The crypto market is experiencing significant volatility as new regulatory frameworks are introduced across major economies.',
        url: 'https://example.com/crypto-regulations',
        source: 'Bloomberg',
        category: 'Cryptocurrency',
        published_at: new Date(Date.now() - 7200000).toISOString(),
        thumbnail_url: 'https://placehold.co/600x400?text=Crypto+News',
        relevance_score: 88
      },
      {
        id: 'mock-trending-2',
        title: 'Housing Market Shows Signs of Cooling After Record Run',
        summary: 'After years of rapid price increases, the housing market is showing initial signs of slowing down as interest rates rise and affordability concerns mount.',
        url: 'https://example.com/housing-market',
        source: 'Reuters',
        category: 'Real Estate',
        published_at: new Date(Date.now() - 10800000).toISOString(),
        thumbnail_url: 'https://placehold.co/600x400?text=Real+Estate',
        relevance_score: 85
      }
    ],
    Business: [
      {
        id: 'mock-business-1',
        title: 'Major Merger Announced in Banking Sector',
        summary: 'Two of the country\'s largest regional banks have announced plans to merge in a deal valued at approximately $30 billion.',
        url: 'https://example.com/bank-merger',
        source: 'Wall Street Journal',
        category: 'Business',
        published_at: new Date(Date.now() - 14400000).toISOString(),
        thumbnail_url: 'https://placehold.co/600x400?text=Banking+News',
        relevance_score: 82
      },
      {
        id: 'mock-business-2',
        title: 'Retail Giant Announces Major Expansion Plans',
        summary: 'A leading retail corporation has unveiled ambitious plans to open 200 new stores nationwide over the next three years.',
        url: 'https://example.com/retail-expansion',
        source: 'Business Insider',
        category: 'Business',
        published_at: new Date(Date.now() - 18000000).toISOString(),
        thumbnail_url: 'https://placehold.co/600x400?text=Retail+News',
        relevance_score: 78
      }
    ],
    Economy: [
      {
        id: 'mock-economy-1',
        title: 'Central Bank Signals Pause in Rate Hikes as Growth Slows',
        summary: 'The central bank has indicated it may temporarily halt its series of interest rate increases as recent economic data points to slowing growth.',
        url: 'https://example.com/rate-pause',
        source: 'The Economist',
        category: 'Economy',
        published_at: new Date(Date.now() - 21600000).toISOString(),
        thumbnail_url: 'https://placehold.co/600x400?text=Economy+News',
        relevance_score: 92
      },
      {
        id: 'mock-economy-2',
        title: 'Job Market Remains Resilient Despite Economic Headwinds',
        summary: 'Despite concerns about a potential recession, the latest employment data shows continued strength in hiring across multiple sectors.',
        url: 'https://example.com/job-market',
        source: 'Financial Times',
        category: 'Economy',
        published_at: new Date(Date.now() - 25200000).toISOString(),
        thumbnail_url: 'https://placehold.co/600x400?text=Jobs+Data',
        relevance_score: 88
      }
    ],
    Financial: [
      {
        id: 'mock-financial-1',
        title: 'New Investment Trends Emerge as Market Dynamics Shift',
        summary: 'Financial advisors are noting significant changes in investment strategies as market conditions evolve in response to global economic factors.',
        url: 'https://example.com/investment-trends',
        source: 'Morgan Stanley',
        category: 'Financial',
        published_at: new Date(Date.now() - 28800000).toISOString(),
        thumbnail_url: 'https://placehold.co/600x400?text=Investment+Trends',
        relevance_score: 86
      },
      {
        id: 'mock-financial-2',
        title: 'ESG Investing Continues to Gain Momentum Among Institutional Investors',
        summary: 'Environmental, Social, and Governance (ESG) criteria are increasingly influencing investment decisions at major institutions.',
        url: 'https://example.com/esg-investing',
        source: 'BlackRock',
        category: 'Financial',
        published_at: new Date(Date.now() - 32400000).toISOString(),
        thumbnail_url: 'https://placehold.co/600x400?text=ESG+Investing',
        relevance_score: 84
      }
    ]
  };

  // Return mocked data for the requested category, or Latest if the category doesn't exist
  return (mockNews[category] || mockNews['Latest']).slice(0, limit);
};
