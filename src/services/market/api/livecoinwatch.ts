
// LiveCoinWatch API integration with optimized caching for free plan
const LIVECOINWATCH_API_KEY = '27eb01ec-4283-4458-a0b3-372bf28a5bfb';
const LIVECOINWATCH_BASE_URL = 'https://api.livecoinwatch.com';

// Enhanced caching with longer duration for free plan optimization
const cache = new Map<string, { data: any, timestamp: number }>();
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes for free plan optimization

interface LiveCoinWatchCoin {
  code: string;
  name: string;
  rate: number;
  volume: number;
  cap: number;
  delta: {
    hour: number;
    day: number;
    week: number;
    month: number;
    quarter: number;
    year: number;
  };
  png32: string;
  png64: string;
  webp32: string;
  webp64: string;
}

interface LiveCoinWatchResponse {
  data: LiveCoinWatchCoin[];
}

// Get comprehensive coin data with all available metrics
export const getLiveCoinWatchData = async (
  codes?: string[], 
  limit: number = 50,
  sort: string = 'rank',
  order: string = 'ascending'
): Promise<any[]> => {
  try {
    console.log('Fetching crypto data from LiveCoinWatch API');
    
    const cacheKey = `livecoinwatch:coins:${codes?.join(',') || 'all'}:${limit}:${sort}:${order}`;
    
    // Check cache first to minimize API calls
    const cachedItem = cache.get(cacheKey);
    if (cachedItem && (Date.now() - cachedItem.timestamp < CACHE_DURATION)) {
      console.log('Using cached LiveCoinWatch data');
      return cachedItem.data;
    }
    
    const requestBody: any = {
      currency: 'USD',
      sort,
      order,
      offset: 0,
      limit: Math.min(limit, 100), // Free plan limit
      meta: true
    };
    
    if (codes && codes.length > 0) {
      requestBody.codes = codes.map(c => c.toUpperCase());
    }
    
    console.log(`Making LiveCoinWatch API request with body:`, requestBody);
    
    const response = await fetch(`${LIVECOINWATCH_BASE_URL}/coins/map`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': LIVECOINWATCH_API_KEY
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      console.error(`LiveCoinWatch API error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }
    
    const data: LiveCoinWatchResponse = await response.json();
    console.log('LiveCoinWatch API response received');
    console.log(`Retrieved ${data.data?.length || 0} coins from LiveCoinWatch`);
    
    if (!data.data) {
      throw new Error('Invalid response from LiveCoinWatch API');
    }
    
    // Transform data to our format
    const transformedData = data.data.map((coin: LiveCoinWatchCoin) => ({
      symbol: coin.code,
      name: coin.name,
      price: coin.rate || 0,
      marketCap: coin.cap || 0,
      volume24h: coin.volume || 0,
      change24h: coin.delta?.day || 0,
      change1h: coin.delta?.hour || 0,
      change7d: coin.delta?.week || 0,
      change30d: coin.delta?.month || 0,
      change1y: coin.delta?.year || 0,
      iconUrl: coin.png64 || coin.png32,
      source: 'LiveCoinWatch'
    }));
    
    // Cache the successful result
    cache.set(cacheKey, { data: transformedData, timestamp: Date.now() });
    
    console.log('Successfully fetched and cached LiveCoinWatch data');
    return transformedData;
    
  } catch (error) {
    console.error('Error fetching LiveCoinWatch data:', error);
    throw error;
  }
};

// Get single coin data with comprehensive metrics
export const getLiveCoinWatchCoin = async (code: string): Promise<any | null> => {
  try {
    console.log(`Fetching ${code} from LiveCoinWatch`);
    
    const cacheKey = `livecoinwatch:coin:${code.toUpperCase()}`;
    const cachedItem = cache.get(cacheKey);
    if (cachedItem && (Date.now() - cachedItem.timestamp < CACHE_DURATION)) {
      console.log('Using cached coin data');
      return cachedItem.data;
    }
    
    const coins = await getLiveCoinWatchData([code], 1);
    const coinData = coins.length > 0 ? coins[0] : null;
    
    if (coinData) {
      cache.set(cacheKey, { data: coinData, timestamp: Date.now() });
    }
    
    return coinData;
  } catch (error) {
    console.error(`Error searching for ${code}:`, error);
    return null;
  }
};

// Get historical price data
export const getLiveCoinWatchHistory = async (
  code: string, 
  start: number, 
  end: number
): Promise<number[][]> => {
  try {
    console.log(`Fetching history for ${code} from ${start} to ${end}`);
    
    const cacheKey = `livecoinwatch:history:${code}:${start}:${end}`;
    const cachedItem = cache.get(cacheKey);
    if (cachedItem && (Date.now() - cachedItem.timestamp < CACHE_DURATION)) {
      console.log('Using cached history data');
      return cachedItem.data;
    }
    
    const requestBody = {
      currency: 'USD',
      code: code.toUpperCase(),
      start,
      end,
      meta: true
    };
    
    const response = await fetch(`${LIVECOINWATCH_BASE_URL}/coins/single/history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': LIVECOINWATCH_API_KEY
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      throw new Error(`History API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    const historyData = data.data?.history || [];
    
    // Cache history data
    cache.set(cacheKey, { data: historyData, timestamp: Date.now() });
    
    return historyData;
  } catch (error) {
    console.error(`Error fetching history for ${code}:`, error);
    return [];
  }
};

// Get comprehensive market overview
export const getLiveCoinWatchOverview = async (): Promise<any> => {
  try {
    console.log('Fetching market overview from LiveCoinWatch');
    
    const cacheKey = 'livecoinwatch:overview';
    const cachedItem = cache.get(cacheKey);
    if (cachedItem && (Date.now() - cachedItem.timestamp < CACHE_DURATION)) {
      console.log('Using cached overview data');
      return cachedItem.data;
    }
    
    const response = await fetch(`${LIVECOINWATCH_BASE_URL}/overview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': LIVECOINWATCH_API_KEY
      },
      body: JSON.stringify({ currency: 'USD' })
    });
    
    if (!response.ok) {
      throw new Error(`Overview API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache overview data
    cache.set(cacheKey, { data: data.data, timestamp: Date.now() });
    
    return data.data;
  } catch (error) {
    console.error('Error fetching market overview:', error);
    return null;
  }
};

// Get exchange data
export const getLiveCoinWatchExchanges = async (): Promise<any[]> => {
  try {
    console.log('Fetching exchanges from LiveCoinWatch');
    
    const cacheKey = 'livecoinwatch:exchanges';
    const cachedItem = cache.get(cacheKey);
    if (cachedItem && (Date.now() - cachedItem.timestamp < CACHE_DURATION)) {
      console.log('Using cached exchanges data');
      return cachedItem.data;
    }
    
    const response = await fetch(`${LIVECOINWATCH_BASE_URL}/exchanges/single`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': LIVECOINWATCH_API_KEY
      },
      body: JSON.stringify({ 
        currency: 'USD',
        sort: 'volume',
        order: 'descending',
        offset: 0,
        limit: 20
      })
    });
    
    if (!response.ok) {
      throw new Error(`Exchanges API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    const exchangesData = data.data || [];
    
    // Cache exchanges data
    cache.set(cacheKey, { data: exchangesData, timestamp: Date.now() });
    
    return exchangesData;
  } catch (error) {
    console.error('Error fetching exchanges:', error);
    return [];
  }
};

// API information for comparison
export const LIVECOINWATCH_API_INFO = {
  name: 'LiveCoinWatch',
  freePlanLimits: {
    requestsPerMonth: 16000,
    requestsPerDay: 500,
    coinsLimit: 100,
    features: [
      'Real-time prices',
      'Historical data',
      'Market overview',
      'Exchange data',
      'Multiple timeframes (1h, 24h, 7d, 30d, 1y)',
      'High-quality images',
      'Comprehensive delta data',
      'Volume and market cap'
    ]
  },
  advantages: [
    'Higher monthly limit (16,000 requests)',
    'Comprehensive delta timeframes',
    'High-quality coin images',
    'Exchange data included',
    'Historical price data',
    'Market overview statistics',
    'Good documentation'
  ],
  limitations: [
    'Daily limit of 500 requests',
    'Limited to 100 coins per request',
    'Requires API key management'
  ]
};
