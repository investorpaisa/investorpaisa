
import { checkRecentArticles } from './utils.ts';
import { generateBatchArticles } from './gemini-api.ts';
import { parseBatchArticles } from './article-parser.ts';
import { insertArticles, filterDuplicateArticles } from './database.ts';

export const crawlArticles = async (
  topic: string = 'financial news',
  limit: number = 5,
  category: string = 'Business'
) => {
  console.log(`Cost-optimized crawling for topic: ${topic}, limit: ${limit}, category: ${category}`);

  // Check for recent articles to avoid duplicates (cost optimization)
  const recentTitles = await checkRecentArticles(category);
  console.log(`Found ${recentTitles.length} recent articles in ${category}`);

  // Limit the actual generation based on recent content
  const maxGenerate = Math.min(limit, 8); // Cap at 8 to control costs
  const actualLimit = recentTitles.length > 5 ? Math.max(1, Math.floor(maxGenerate / 2)) : maxGenerate;

  console.log(`Generating ${actualLimit} articles to optimize costs`);

  // Single API call to generate multiple articles
  const batchContent = await generateBatchArticles(topic, category, actualLimit);
  const articles = parseBatchArticles(batchContent, category);

  console.log(`Parsed ${articles.length} articles from batch response`);

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
      console.log(`Successfully batch inserted ${filteredArticles.length} articles`);
    }
  }

  return {
    success: true,
    articles: filteredArticles,
    message: `Successfully generated ${filteredArticles.length} articles with cost optimization`,
    costOptimizations: {
      apiCallsUsed: 1,
      duplicatesFiltered: articles.length - filteredArticles.length,
      recentArticlesFound: recentTitles.length
    }
  };
};
