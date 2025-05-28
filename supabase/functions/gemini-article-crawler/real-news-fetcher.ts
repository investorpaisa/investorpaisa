
interface RealNewsArticle {
  title: string;
  summary: string;
  url: string;
  imageUrl: string;
  source: string;
  publishedAt: string;
}

// RSS feed URLs for major financial news sources
const RSS_FEEDS = {
  'Business': [
    'https://feeds.bloomberg.com/markets/news.rss',
    'https://feeds.reuters.com/reuters/businessNews.rss',
    'https://rss.cnn.com/rss/money_latest.rss'
  ],
  'Markets': [
    'https://feeds.bloomberg.com/markets/news.rss',
    'https://feeds.reuters.com/reuters/marketsNews.rss'
  ],
  'Cryptocurrency': [
    'https://feeds.feedburner.com/CoinDesk',
    'https://cointelegraph.com/rss'
  ],
  'Economy': [
    'https://feeds.reuters.com/reuters/economicNews.rss',
    'https://feeds.bloomberg.com/economics/news.rss'
  ]
};

export const fetchRealNewsArticles = async (category: string, limit: number = 5): Promise<RealNewsArticle[]> => {
  console.log(`Fetching real news for category: ${category}, limit: ${limit}`);
  
  const feedUrls = RSS_FEEDS[category] || RSS_FEEDS['Business'];
  const articles: RealNewsArticle[] = [];
  
  try {
    // Try to fetch from RSS feeds
    for (const feedUrl of feedUrls.slice(0, 2)) { // Limit to 2 feeds to avoid too many requests
      try {
        console.log(`Fetching from RSS feed: ${feedUrl}`);
        
        const response = await fetch(feedUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)'
          }
        });
        
        if (!response.ok) {
          console.error(`RSS feed error: ${response.status} for ${feedUrl}`);
          continue;
        }
        
        const xmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlText, 'text/xml');
        
        const items = doc.querySelectorAll('item');
        
        for (let i = 0; i < Math.min(items.length, Math.ceil(limit / 2)); i++) {
          const item = items[i];
          
          const title = item.querySelector('title')?.textContent?.trim() || '';
          const link = item.querySelector('link')?.textContent?.trim() || '';
          const description = item.querySelector('description')?.textContent?.trim() || '';
          const pubDate = item.querySelector('pubDate')?.textContent?.trim() || '';
          
          // Extract image from media:content or enclosure
          let imageUrl = '';
          const mediaContent = item.querySelector('media\\:content, content');
          const enclosure = item.querySelector('enclosure[type^="image"]');
          
          if (mediaContent) {
            imageUrl = mediaContent.getAttribute('url') || '';
          } else if (enclosure) {
            imageUrl = enclosure.getAttribute('url') || '';
          }
          
          // Fallback to a relevant financial image if no image found
          if (!imageUrl) {
            imageUrl = `https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop&q=80`;
          }
          
          // Extract source from feed URL
          const sourceMatch = feedUrl.match(/https?:\/\/(?:feeds\.)?([^\/]+)/);
          const source = sourceMatch ? sourceMatch[1].replace('www.', '').toUpperCase() : 'Unknown';
          
          if (title && link && description) {
            articles.push({
              title,
              summary: description.substring(0, 300) + (description.length > 300 ? '...' : ''),
              url: link,
              imageUrl,
              source,
              publishedAt: pubDate || new Date().toISOString()
            });
          }
        }
        
        if (articles.length >= limit) break;
        
      } catch (feedError) {
        console.error(`Error processing RSS feed ${feedUrl}:`, feedError);
        continue;
      }
    }
    
    console.log(`Successfully fetched ${articles.length} real articles`);
    return articles.slice(0, limit);
    
  } catch (error) {
    console.error('Error fetching real news:', error);
    return [];
  }
};

// Fallback function using NewsAPI (requires API key)
export const fetchFromNewsAPI = async (topic: string, limit: number = 5): Promise<RealNewsArticle[]> => {
  const newsApiKey = Deno.env.get('NEWS_API_KEY');
  
  if (!newsApiKey) {
    console.log('NEWS_API_KEY not found, skipping NewsAPI fetch');
    return [];
  }
  
  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&language=en&sortBy=publishedAt&pageSize=${limit}`,
      {
        headers: {
          'X-API-Key': newsApiKey
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.articles.map((article: any) => ({
      title: article.title,
      summary: article.description || article.content?.substring(0, 300) + '...',
      url: article.url,
      imageUrl: article.urlToImage || `https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop&q=80`,
      source: article.source.name,
      publishedAt: article.publishedAt
    }));
    
  } catch (error) {
    console.error('Error fetching from NewsAPI:', error);
    return [];
  }
};
