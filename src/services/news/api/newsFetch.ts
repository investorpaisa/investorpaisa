
import { supabase } from '@/integrations/supabase/client';

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
