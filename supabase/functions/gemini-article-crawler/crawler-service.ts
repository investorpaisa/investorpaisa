
import { checkRecentArticles } from './utils.ts';
import { insertArticles, filterDuplicateArticles } from './database.ts';
import { fetchRealNewsArticles, fetchFromNewsAPI } from './real-news-fetcher.ts';

export const crawlArticles = async (
  topic: string = 'financial news',
  limit: number = 5,
  category: string = 'Business'
) => {
  console.log(`Starting real news crawling for topic: "${topic}", limit: ${limit}, category: ${category}`);

  // Check for recent articles to avoid duplicates
  const recentTitles = await checkRecentArticles(category);
  console.log(`Found ${recentTitles.length} recent articles in ${category} category`);

  // First try to fetch real articles from RSS feeds
  console.log('Attempting to fetch articles from RSS feeds...');
  let realArticles = await fetchRealNewsArticles(category, limit);
  console.log(`RSS feeds provided ${realArticles.length} articles`);

  // If RSS feeds don't provide enough articles, try NewsAPI as fallback
  if (realArticles.length < limit) {
    console.log(`RSS feeds provided ${realArticles.length}/${limit} articles, trying NewsAPI for more`);
    const newsApiArticles = await fetchFromNewsAPI(topic, limit - realArticles.length);
    console.log(`NewsAPI provided ${newsApiArticles.length} additional articles`);
    realArticles = [...realArticles, ...newsApiArticles];
  }

  if (realArticles.length === 0) {
    console.error('No real articles found from any source');
    return {
      success: false,
      articles: [],
      message: 'Unable to fetch real articles at this time. Please check your internet connection and try again.',
      costOptimizations: {
        apiCallsUsed: 0,
        duplicatesFiltered: 0,
        recentArticlesFound: recentTitles.length,
        sourcesAttempted: ['RSS Feeds', 'NewsAPI'],
        sourcesUsed: []
      }
    };
  }

  console.log(`Total real articles collected: ${realArticles.length}`);

  // Convert real articles to our database format
  const articles = realArticles.map((article, index) => {
    const articleId = `real-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`Processing article ${index + 1}/${realArticles.length}: "${article.title.substring(0, 50)}..."`);
    
    return {
      id: articleId,
      title: article.title,
      summary: article.summary,
      content: article.summary, // Using summary as content for now
      url: article.url,
      source: article.source,
      category: category,
      published_at: article.publishedAt || new Date().toISOString(),
      thumbnail_url: article.imageUrl,
      relevance_score: 85 + Math.floor(Math.random() * 10), // Higher score for real articles
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  });

  console.log(`Processed ${articles.length} real articles for database insertion`);

  // Filter out potential duplicates based on title similarity
  const filteredArticles = filterDuplicateArticles(articles, recentTitles);
  console.log(`${filteredArticles.length} articles remain after duplicate filtering`);

  // Get unique sources used
  const sourcesUsed = realArticles.map(a => a.source).filter((v, i, a) => a.indexOf(v) === i);

  // Batch insert to database for efficiency
  if (filteredArticles.length > 0) {
    console.log(`Attempting to insert ${filteredArticles.length} articles into database...`);
    const { error: insertError } = await insertArticles(filteredArticles);

    if (insertError) {
      console.error('Error batch inserting articles:', insertError);
      throw new Error(`Failed to insert articles into database: ${insertError.message}`);
    } else {
      console.log(`Successfully batch inserted ${filteredArticles.length} real articles into database`);
    }
  } else {
    console.log('No new articles to insert after filtering');
  }

  return {
    success: true,
    articles: filteredArticles,
    message: `Successfully crawled ${filteredArticles.length} real articles from ${realArticles.length} sources`,
    costOptimizations: {
      apiCallsUsed: 0, // RSS feeds are free
      duplicatesFiltered: articles.length - filteredArticles.length,
      recentArticlesFound: recentTitles.length,
      sourcesUsed: sourcesUsed
    }
  };
};
