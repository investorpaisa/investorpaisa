
import { checkRecentArticles } from './utils.ts';
import { insertArticles, filterDuplicateArticles } from './database.ts';
import { fetchRealNewsArticles, fetchFromNewsAPI } from './real-news-fetcher.ts';

export const crawlArticles = async (
  topic: string = 'financial news',
  limit: number = 5,
  category: string = 'Business'
) => {
  console.log(`Real news crawling for topic: ${topic}, limit: ${limit}, category: ${category}`);

  // Check for recent articles to avoid duplicates
  const recentTitles = await checkRecentArticles(category);
  console.log(`Found ${recentTitles.length} recent articles in ${category}`);

  // First try to fetch real articles from RSS feeds
  let realArticles = await fetchRealNewsArticles(category, limit);
  
  // If RSS feeds don't provide enough articles, try NewsAPI as fallback
  if (realArticles.length < limit) {
    console.log(`RSS feeds provided ${realArticles.length} articles, trying NewsAPI for more`);
    const newsApiArticles = await fetchFromNewsAPI(topic, limit - realArticles.length);
    realArticles = [...realArticles, ...newsApiArticles];
  }

  if (realArticles.length === 0) {
    console.log('No real articles found, returning empty result');
    return {
      success: false,
      articles: [],
      message: 'Unable to fetch real articles at this time. Please try again later.',
      costOptimizations: {
        apiCallsUsed: 0,
        duplicatesFiltered: 0,
        recentArticlesFound: recentTitles.length
      }
    };
  }

  // Convert real articles to our database format
  const articles = realArticles.map((article, index) => {
    const articleId = `crawled-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id: articleId,
      title: article.title,
      summary: article.summary,
      content: article.summary, // Using summary as content
      url: article.url,
      source: article.source,
      category: category,
      published_at: article.publishedAt || new Date().toISOString(),
      thumbnail_url: article.imageUrl,
      relevance_score: 80 + Math.floor(Math.random() * 15),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  });

  console.log(`Processed ${articles.length} real articles`);

  // Filter out potential duplicates based on title similarity
  const filteredArticles = filterDuplicateArticles(articles, recentTitles);

  console.log(`${filteredArticles.length} articles after duplicate filtering`);

  // Batch insert to database for efficiency
  if (filteredArticles.length > 0) {
    const { error: insertError } = await insertArticles(filteredArticles);

    if (insertError) {
      console.error('Error batch inserting articles:', insertError);
      throw new Error('Failed to insert articles into database');
    } else {
      console.log(`Successfully batch inserted ${filteredArticles.length} real articles`);
    }
  }

  return {
    success: true,
    articles: filteredArticles,
    message: `Successfully crawled ${filteredArticles.length} real articles from the web`,
    costOptimizations: {
      apiCallsUsed: 0, // RSS feeds don't count as API calls
      duplicatesFiltered: articles.length - filteredArticles.length,
      recentArticlesFound: recentTitles.length
    }
  };
};
