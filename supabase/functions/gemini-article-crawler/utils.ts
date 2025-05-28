
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Use service role client for database operations
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const checkRecentArticles = async (category: string): Promise<string[]> => {
  try {
    console.log(`Checking recent articles for category: ${category}`);
    
    const { data, error } = await supabase
      .from('news_articles')
      .select('title')
      .eq('category', category)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
      .limit(50);

    if (error) {
      console.error('Error checking recent articles:', error);
      return [];
    }

    console.log(`Found ${data?.length || 0} recent articles for ${category}`);
    return data?.map(article => article.title.toLowerCase()) || [];
  } catch (error) {
    console.error('Error in checkRecentArticles:', error);
    return [];
  }
};
