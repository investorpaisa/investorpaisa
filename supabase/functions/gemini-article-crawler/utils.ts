
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cost optimization: Check for recent articles to avoid duplicates
export const checkRecentArticles = async (category: string, hoursBack = 6) => {
  const cutoffTime = new Date(Date.now() - (hoursBack * 60 * 60 * 1000)).toISOString();
  
  const { data, error } = await supabase
    .from('news_articles')
    .select('title')
    .eq('category', category)
    .gte('published_at', cutoffTime);
    
  return data?.map(article => article.title.toLowerCase()) || [];
};
