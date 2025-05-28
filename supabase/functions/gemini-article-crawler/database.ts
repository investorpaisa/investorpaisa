
import { supabase } from './utils.ts';

export const insertArticles = async (articles: any[]) => {
  if (articles.length === 0) {
    console.log('No articles to insert');
    return { error: null };
  }
  
  console.log(`Attempting to insert ${articles.length} articles into news_articles table`);
  
  try {
    // Insert articles in smaller batches to avoid timeout issues
    const batchSize = 10;
    let totalInserted = 0;
    
    for (let i = 0; i < articles.length; i += batchSize) {
      const batch = articles.slice(i, i + batchSize);
      console.log(`Inserting batch ${Math.floor(i / batchSize) + 1} with ${batch.length} articles`);
      
      const { data, error } = await supabase
        .from('news_articles')
        .insert(batch)
        .select('id');

      if (error) {
        console.error(`Error inserting batch:`, error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        return { error };
      }
      
      totalInserted += data?.length || 0;
      console.log(`Successfully inserted batch, total so far: ${totalInserted}`);
    }
    
    console.log(`Successfully inserted all ${totalInserted} articles`);
    return { error: null };
    
  } catch (error) {
    console.error('Unexpected error during article insertion:', error);
    return { error };
  }
};

export const filterDuplicateArticles = (articles: any[], recentTitles: string[]) => {
  console.log(`Filtering ${articles.length} articles against ${recentTitles.length} recent titles`);
  
  const filtered = articles.filter(article => {
    const titleLower = article.title.toLowerCase();
    const isDuplicate = recentTitles.some(recentTitle => {
      const similarity = titleLower.includes(recentTitle) || recentTitle.includes(titleLower);
      if (similarity) {
        console.log(`Duplicate detected: "${article.title}" similar to recent article`);
      }
      return similarity;
    });
    return !isDuplicate;
  });
  
  console.log(`Filtered out ${articles.length - filtered.length} duplicate articles`);
  return filtered;
};
