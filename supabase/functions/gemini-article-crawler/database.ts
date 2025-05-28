
import { supabase } from './utils.ts';

export const insertArticles = async (articles: any[]) => {
  if (articles.length === 0) return { error: null };
  
  const { error } = await supabase
    .from('news_articles')
    .insert(articles);

  return { error };
};

export const filterDuplicateArticles = (articles: any[], recentTitles: string[]) => {
  return articles.filter(article => {
    const titleLower = article.title.toLowerCase();
    return !recentTitles.some(recentTitle => 
      titleLower.includes(recentTitle) || recentTitle.includes(titleLower)
    );
  });
};
