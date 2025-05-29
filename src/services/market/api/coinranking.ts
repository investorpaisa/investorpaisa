
// Coinranking API integration with optimized caching
const COINRANKING_API_KEY = 'coinrankingd3d3c87b784bd845639c0536a1807c222e02821d45ba5b3a';
const COINRANKING_BASE_URL = 'https://api.coinranking.com/v2';

// Enhanced caching with longer duration for free plan optimization
const cache = new Map<string, { data: any, timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes for free plan optimization

interface CoinrankingCoin {
  uuid: string;
  symbol: string;
  name: string;
  iconUrl: string;
  price: string;
  marketCap: string;
  '24hVolume': string;
  change: string;
  sparkline: string[];
  rank: number;
}

interface CoinrankingResponse {
  status: string;
  data: {
    stats: {
      total: number;
      totalMarkets: number;
    };
    coins: CoinrankingCoin[];
  };
}

// Optimized function to get live crypto prices with intelligent caching
export const getCoinrankingData = async (
  symbols?: string[], 
  limit: number = 50
): Promise<any[]> => {
  try {
    console.log('Fetching crypto data from Coinranking API');
    
    // Create cache key based on symbols and limit
    const cacheKey = `coinranking:${symbols?.join(',') || 'all'}:${limit}`;
    
    // Check cache first to minimize API calls
    const cachedItem = cache.get(cacheKey);
    if (cachedItem && (Date.now() - cachedItem.timestamp < CACHE_DURATION)) {
      console.log('Using cached Coinranking data');
      return cachedItem.data;
    }
    
    // Build URL with optimized parameters for free plan
    let url = `${COINRANKING_BASE_URL}/coins?limit=${Math.min(limit, 50)}`; // Free plan limit
    
    // Add symbols filter if provided
    if (symbols && symbols.length > 0) {
      url += `&symbols=${symbols.map(s => s.toUpperCase()).join(',')}`;
    }
    
    // Add additional parameters for comprehensive data
    url += '&timePeriod=24h&orderBy=marketCap&orderDirection=desc';
    
    console.log(`Making Coinranking API request: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': COINRANKING_API_KEY,
        'X-RapidAPI-Host': 'api.coinranking.com'
      }
    });
    
    if (!response.ok) {
      console.error(`Coinranking API error: ${response.status} ${response.statusText}`);
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data: CoinrankingResponse = await response.json();
    console.log('Coinranking API response status:', data.status);
    console.log(`Retrieved ${data.data?.coins?.length || 0} coins from Coinranking`);
    
    if (data.status !== 'success' || !data.data?.coins) {
      throw new Error('Invalid response from Coinranking API');
    }
    
    // Transform data to our format
    const transformedData = data.data.coins.map((coin: CoinrankingCoin) => ({
      symbol: coin.symbol,
      name: coin.name,
      price: parseFloat(coin.price) || 0,
      marketCap: parseFloat(coin.marketCap) || 0,
      volume24h: parseFloat(coin['24hVolume']) || 0,
      change24h: parseFloat(coin.change) || 0,
      rank: coin.rank,
      iconUrl: coin.iconUrl,
      sparkline: { 
        price: coin.sparkline?.map(price => parseFloat(price) || 0) || [] 
      },
      source: 'Coinranking'
    }));
    
    // Cache the successful result
    cache.set(cacheKey, { data: transformedData, timestamp: Date.now() });
    
    console.log('Successfully fetched and cached Coinranking data');
    return transformedData;
    
  } catch (error) {
    console.error('Error fetching Coinranking data:', error);
    throw error;
  }
};

// Get trending coins (optimized for free plan)
export const getTrendingCoins = async (): Promise<any[]> => {
  try {
    console.log('Fetching trending coins from Coinranking');
    
    const cacheKey = 'coinranking:trending';
    const cachedItem = cache.get(cacheKey);
    if (cachedItem && (Date.now() - cachedItem.timestamp < CACHE_DURATION)) {
      console.log('Using cached trending data');
      return cachedItem.data;
    }
    
    // Get top 10 coins by market cap as "trending"
    const coins = await getCoinrankingData(undefined, 10);
    
    // Cache trending data
    cache.set(cacheKey, { data: coins, timestamp: Date.now() });
    
    return coins;
  } catch (error) {
    console.error('Error fetching trending coins:', error);
    return [];
  }
};

// Search for specific coin
export const searchCoin = async (symbol: string): Promise<any | null> => {
  try {
    console.log(`Searching for ${symbol} on Coinranking`);
    
    const coins = await getCoinrankingData([symbol], 1);
    return coins.length > 0 ? coins[0] : null;
  } catch (error) {
    console.error(`Error searching for ${symbol}:`, error);
    return null;
  }
};

// Get chart data for a specific coin (free plan optimization)
export const getCoinChart = async (coinUuid: string): Promise<number[]> => {
  try {
    console.log(`Fetching chart for coin ${coinUuid}`);
    
    const cacheKey = `coinranking:chart:${coinUuid}`;
    const cachedItem = cache.get(cacheKey);
    if (cachedItem && (Date.now() - cachedItem.timestamp < CACHE_DURATION)) {
      console.log('Using cached chart data');
      return cachedItem.data;
    }
    
    const url = `${COINRANKING_BASE_URL}/coin/${coinUuid}/history?timePeriod=7d`;
    
    const response = await fetch(url, {
      headers: {
        'X-RapidAPI-Key': COINRANKING_API_KEY,
        'X-RapidAPI-Host': 'api.coinranking.com'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Chart API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 'success' || !data.data?.history) {
      throw new Error('Invalid chart response');
    }
    
    const chartData = data.data.history.map((item: any) => parseFloat(item.price) || 0);
    
    // Cache chart data
    cache.set(cacheKey, { data: chartData, timestamp: Date.now() });
    
    return chartData;
  } catch (error) {
    console.error(`Error fetching chart for ${coinUuid}:`, error);
    return [];
  }
};

// API comparison data
export const COINRANKING_API_INFO = {
  name: 'Coinranking',
  freePlanLimits: {
    requestsPerMonth: 10000,
    requestsPerMinute: 1000,
    coinsLimit: 50,
    features: [
      'Real-time prices',
      'Market data',
      '24h volume',
      'Price change',
      'Market cap',
      'Sparkline data',
      'Historical data (limited)',
      'Coin search'
    ]
  },
  advantages: [
    'Higher monthly limit (10,000 vs fallback data)',
    'Real-time accurate data',
    'Comprehensive coin coverage',
    'Built-in sparkline data',
    'Good rate limiting',
    'Reliable uptime'
  ],
  limitations: [
    'Limited to 50 coins per request on free plan',
    'Historical data limited on free plan',
    'No unlimited usage'
  ]
};
