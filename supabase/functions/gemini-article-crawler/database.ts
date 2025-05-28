
import { supabase } from './utils.ts';

export const insertArticles = async (articles: any[]) => {
  if (articles.length === 0) {
    console.log('No articles to insert');
    return { error: null };
  }
  
  console.log(`Attempting to insert ${articles.length} articles into news_articles table`);
  
  try {
    // Insert articles in smaller batches to avoid timeout issues
    const batchSize = 5;
    const batches = [];
    
    for (let i = 0; i < articles.length; i += batchSize) {
      batches.push(articles.slice(i, i + batchSize));
    }
    
    console.log(`Splitting into ${batches.length} batches of ${batchSize} articles each`);
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`Inserting batch ${i + 1}/${batches.length} with ${batch.length} articles`);
      
      const { error } = await supabase
        .from('news_articles')
        .insert(batch);

      if (error) {
        console.error(`Error inserting batch ${i + 1}:`, error);
        return { error };
      }
      
      console.log(`Successfully inserted batch ${i + 1}/${batches.length}`);
    }
    
    console.log(`Successfully inserted all ${articles.length} articles`);
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
