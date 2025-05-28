
interface RealNewsArticle {
  title: string;
  summary: string;
  url: string;
  imageUrl: string;
  source: string;
  publishedAt: string;
}

// Comprehensive RSS feed URLs for major financial and news sources
const RSS_FEEDS = {
  'Business': [
    'https://feeds.bloomberg.com/markets/news.rss',
    'https://feeds.reuters.com/reuters/businessNews.rss',
    'https://rss.cnn.com/rss/money_latest.rss',
    'https://feeds.feedburner.com/wsj/xml/rss/3_7011.xml',
    'https://www.cnbc.com/id/10001147/device/rss/rss.html',
    'https://feeds.marketwatch.com/marketwatch/marketpulse/',
    'https://feeds.fortune.com/fortune/feeds',
    'https://feeds.feedburner.com/ForbesBusinessNews'
  ],
  'Markets': [
    'https://feeds.bloomberg.com/markets/news.rss',
    'https://feeds.reuters.com/reuters/marketsNews.rss',
    'https://feeds.marketwatch.com/marketwatch/topstories/',
    'https://www.cnbc.com/id/15839135/device/rss/rss.html',
    'https://feeds.yahoo.com/rss/mostviewed'
  ],
  'Cryptocurrency': [
    'https://feeds.feedburner.com/CoinDesk',
    'https://cointelegraph.com/rss',
    'https://feeds.coinbase.com/blog',
    'https://feeds.decrypt.co/feed',
    'https://feeds.cryptonews.net/news'
  ],
  'Economy': [
    'https://feeds.reuters.com/reuters/economicNews.rss',
    'https://feeds.bloomberg.com/economics/news.rss',
    'https://feeds.marketwatch.com/marketwatch/economy/',
    'https://www.federalreserve.gov/feeds/press_all.xml'
  ],
  'Technology': [
    'https://feeds.reuters.com/reuters/technologyNews.rss',
    'https://feeds.bloomberg.com/technology/news.rss',
    'https://feeds.feedburner.com/TechCrunch/',
    'https://feeds.arstechnica.com/arstechnica/index'
  ]
};

export const fetchRealNewsArticles = async (category: string, limit: number = 5): Promise<RealNewsArticle[]> => {
  console.log(`Fetching real news for category: ${category}, limit: ${limit}`);
  
  const feedUrls = RSS_FEEDS[category] || RSS_FEEDS['Business'];
  const articles: RealNewsArticle[] = [];
  
  try {
    // Try to fetch from multiple RSS feeds
    for (const feedUrl of feedUrls.slice(0, 4)) { // Use up to 4 feeds per category
      try {
        console.log(`Fetching from RSS feed: ${feedUrl}`);
        
        const response = await fetch(feedUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0; +http://lovable.dev)',
            'Accept': 'application/rss+xml, application/xml, text/xml',
            'Cache-Control': 'no-cache'
          },
          signal: AbortSignal.timeout(10000) // 10 second timeout
        });
        
        if (!response.ok) {
          console.error(`RSS feed error: ${response.status} ${response.statusText} for ${feedUrl}`);
          continue;
        }
        
        const xmlText = await response.text();
        console.log(`Received XML content length: ${xmlText.length} from ${feedUrl}`);
        
        // Parse XML using DOMParser
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlText, 'text/xml');
        
        // Check for parsing errors
        const parserError = doc.querySelector('parsererror');
        if (parserError) {
          console.error(`XML parsing error for ${feedUrl}:`, parserError.textContent);
          continue;
        }
        
        // Try different item selectors for different RSS formats
        let items = doc.querySelectorAll('item');
        if (items.length === 0) {
          items = doc.querySelectorAll('entry'); // Atom format
        }
        
        console.log(`Found ${items.length} items in RSS feed: ${feedUrl}`);
        
        for (let i = 0; i < Math.min(items.length, Math.ceil(limit / 2)); i++) {
          const item = items[i];
          
          // Extract title
          let title = item.querySelector('title')?.textContent?.trim() || '';
          if (!title) {
            title = item.querySelector('title')?.getAttribute('value')?.trim() || '';
          }
          
          // Extract link
          let link = item.querySelector('link')?.textContent?.trim() || '';
          if (!link) {
            link = item.querySelector('link')?.getAttribute('href')?.trim() || '';
          }
          
          // Extract description/summary
          let description = item.querySelector('description')?.textContent?.trim() || '';
          if (!description) {
            description = item.querySelector('summary')?.textContent?.trim() || '';
          }
          if (!description) {
            description = item.querySelector('content')?.textContent?.trim() || '';
          }
          
          // Extract publication date
          let pubDate = item.querySelector('pubDate')?.textContent?.trim() || '';
          if (!pubDate) {
            pubDate = item.querySelector('published')?.textContent?.trim() || '';
          }
          if (!pubDate) {
            pubDate = item.querySelector('updated')?.textContent?.trim() || '';
          }
          
          // Extract image from various sources
          let imageUrl = '';
          
          // Try media:content
          const mediaContent = item.querySelector('media\\:content, content[type*="image"]');
          if (mediaContent) {
            imageUrl = mediaContent.getAttribute('url') || '';
          }
          
          // Try enclosure
          if (!imageUrl) {
            const enclosure = item.querySelector('enclosure[type^="image"]');
            if (enclosure) {
              imageUrl = enclosure.getAttribute('url') || '';
            }
          }
          
          // Try media:thumbnail
          if (!imageUrl) {
            const mediaThumbnail = item.querySelector('media\\:thumbnail, thumbnail');
            if (mediaThumbnail) {
              imageUrl = mediaThumbnail.getAttribute('url') || '';
            }
          }
          
          // Try og:image or similar in description
          if (!imageUrl && description) {
            const imgMatch = description.match(/<img[^>]+src="([^"]+)"/i);
            if (imgMatch) {
              imageUrl = imgMatch[1];
            }
          }
          
          // Fallback to a relevant financial image
          if (!imageUrl) {
            const imageKeywords = ['finance', 'business', 'market', 'economy', 'tech', 'crypto'];
            const randomKeyword = imageKeywords[Math.floor(Math.random() * imageKeywords.length)];
            imageUrl = `https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop&q=80&auto=format`;
          }
          
          // Extract source from feed URL or title
          let source = '';
          if (feedUrl.includes('bloomberg')) source = 'Bloomberg';
          else if (feedUrl.includes('reuters')) source = 'Reuters';
          else if (feedUrl.includes('cnn')) source = 'CNN';
          else if (feedUrl.includes('wsj')) source = 'Wall Street Journal';
          else if (feedUrl.includes('cnbc')) source = 'CNBC';
          else if (feedUrl.includes('marketwatch')) source = 'MarketWatch';
          else if (feedUrl.includes('fortune')) source = 'Fortune';
          else if (feedUrl.includes('forbes')) source = 'Forbes';
          else if (feedUrl.includes('coindesk')) source = 'CoinDesk';
          else if (feedUrl.includes('cointelegraph')) source = 'Cointelegraph';
          else if (feedUrl.includes('techcrunch')) source = 'TechCrunch';
          else {
            const sourceMatch = feedUrl.match(/https?:\/\/(?:feeds\.)?(?:www\.)?([^\/\.]+)/);
            source = sourceMatch ? sourceMatch[1].toUpperCase() : 'Unknown Source';
          }
          
          // Clean up description (remove HTML tags)
          if (description) {
            description = description.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim();
            if (description.length > 300) {
              description = description.substring(0, 297) + '...';
            }
          }
          
          // Only add if we have essential fields
          if (title && link && description) {
            console.log(`Adding article: ${title.substring(0, 50)}...`);
            articles.push({
              title: title,
              summary: description,
              url: link,
              imageUrl: imageUrl,
              source: source,
              publishedAt: pubDate || new Date().toISOString()
            });
          } else {
            console.log(`Skipping incomplete article: title=${!!title}, link=${!!link}, description=${!!description}`);
          }
        }
        
        // Stop if we have enough articles
        if (articles.length >= limit) break;
        
      } catch (feedError) {
        console.error(`Error processing RSS feed ${feedUrl}:`, feedError);
        continue;
      }
    }
    
    console.log(`Successfully fetched ${articles.length} real articles from RSS feeds`);
    return articles.slice(0, limit);
    
  } catch (error) {
    console.error('Error fetching real news:', error);
    return [];
  }
};

// Enhanced fallback function using NewsAPI with more sources
export const fetchFromNewsAPI = async (topic: string, limit: number = 5): Promise<RealNewsArticle[]> => {
  const newsApiKey = Deno.env.get('NEWS_API_KEY');
  
  if (!newsApiKey) {
    console.log('NEWS_API_KEY not found, skipping NewsAPI fetch');
    return [];
  }
  
  try {
    console.log(`Fetching from NewsAPI with topic: ${topic}`);
    
    // Try multiple NewsAPI endpoints for better coverage
    const endpoints = [
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&language=en&sortBy=publishedAt&pageSize=${limit}&domains=bloomberg.com,reuters.com,cnbc.com,marketwatch.com,wsj.com,fortune.com`,
      `https://newsapi.org/v2/top-headlines?category=business&language=en&pageSize=${limit}`,
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&language=en&sortBy=popularity&pageSize=${limit}`
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          headers: {
            'X-API-Key': newsApiKey,
            'User-Agent': 'NewsBot/1.0'
          },
          signal: AbortSignal.timeout(10000)
        });
        
        if (!response.ok) {
          console.error(`NewsAPI error: ${response.status} ${response.statusText}`);
          continue;
        }
        
        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
          console.log(`NewsAPI returned ${data.articles.length} articles`);
          
          return data.articles.slice(0, limit).map((article: any) => ({
            title: article.title || 'Untitled',
            summary: article.description || article.content?.substring(0, 300) + '...' || 'No summary available',
            url: article.url || '#',
            imageUrl: article.urlToImage || `https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop&q=80`,
            source: article.source?.name || 'News Source',
            publishedAt: article.publishedAt || new Date().toISOString()
          }));
        }
      } catch (endpointError) {
        console.error(`Error with NewsAPI endpoint ${endpoint}:`, endpointError);
        continue;
      }
    }
    
    return [];
    
  } catch (error) {
    console.error('Error fetching from NewsAPI:', error);
    return [];
  }
};
