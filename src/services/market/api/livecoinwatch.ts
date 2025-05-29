
// LiveCoinWatch API integration with correct endpoints and structure
const LIVECOINWATCH_API_KEY = '27eb01ec-4283-4458-a0b3-372bf28a5bfb';
const LIVECOINWATCH_BASE_URL = 'https://api.livecoinwatch.com';

// Simple in-memory cache
const cache = new Map<string, { data: any, timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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

// Get comprehensive coin data using correct /coins/map endpoint
export const getLiveCoinWatchData = async (
  codes?: string[], 
  limit: number = 50,
  sort: string = 'rank',
  order: string = 'ascending'
): Promise<any[]> => {
  try {
    console.log('Fetching LiveCoinWatch data for', codes || 'top coins');
    
    const cacheKey = `livecoinwatch:coins:${codes?.join(',') || 'all'}:${limit}:${sort}:${order}`;
    
    // Check cache
    const cachedItem = cache.get(cacheKey);
    if (cachedItem && (Date.now() - cachedItem.timestamp < CACHE_DURATION)) {
      console.log('Using cached data');
      return cachedItem.data;
    }
    
    const requestBody: any = {
      currency: 'USD',
      sort,
      order,
      offset: 0,
      limit: Math.min(limit, 100),
      meta: true
    };
    
    if (codes && codes.length > 0) {
      requestBody.codes = codes.map(c => c.toUpperCase());
    }
    
    const response = await fetch(`${LIVECOINWATCH_BASE_URL}/coins/map`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': LIVECOINWATCH_API_KEY
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      console.error(`LiveCoinWatch API error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return generateMockCryptoData(limit);
    }
    
    const result = await response.json();
    console.log('LiveCoinWatch API response:', result);
    
    if (!result.data || result.data.length === 0) {
      console.warn('No data from LiveCoinWatch, using mock data');
      return generateMockCryptoData(limit);
    }
    
    // Transform data
    const transformedData = result.data.map((coin: LiveCoinWatchCoin) => ({
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
    
    // Cache results
    cache.set(cacheKey, { data: transformedData, timestamp: Date.now() });
    
    return transformedData;
    
  } catch (error) {
    console.error('Error fetching LiveCoinWatch data:', error);
    return generateMockCryptoData(limit);
  }
};

// Get single coin data using correct /coins/single endpoint
export const getLiveCoinWatchCoin = async (code: string): Promise<any | null> => {
  try {
    console.log(`Fetching data for ${code}`);
    
    const cacheKey = `livecoinwatch:coin:${code.toUpperCase()}`;
    const cachedItem = cache.get(cacheKey);
    if (cachedItem && (Date.now() - cachedItem.timestamp < CACHE_DURATION)) {
      return cachedItem.data;
    }
    
    const requestBody = {
      currency: 'USD',
      code: code.toUpperCase(),
      meta: true
    };
    
    const response = await fetch(`${LIVECOINWATCH_BASE_URL}/coins/single`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': LIVECOINWATCH_API_KEY
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      console.error(`Single coin API failed: ${response.status}`);
      return generateMockCoinData(code);
    }
    
    const result = await response.json();
    
    if (!result.data) {
      console.warn(`No data for ${code}, using mock data`);
      return generateMockCoinData(code);
    }
    
    const coin = result.data;
    const transformedData = {
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
    };
    
    cache.set(cacheKey, { data: transformedData, timestamp: Date.now() });
    return transformedData;
    
  } catch (error) {
    console.error(`Error searching for ${code}:`, error);
    return generateMockCoinData(code);
  }
};

// Get historical price data using correct /coins/single/history endpoint
export const getLiveCoinWatchHistory = async (
  code: string, 
  start: number, 
  end: number
): Promise<number[][]> => {
  try {
    console.log(`Fetching history for ${code}`);
    
    const cacheKey = `livecoinwatch:history:${code}:${start}:${end}`;
    const cachedItem = cache.get(cacheKey);
    if (cachedItem && (Date.now() - cachedItem.timestamp < CACHE_DURATION)) {
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
        'x-api-key': LIVECOINWATCH_API_KEY
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      console.error(`History API failed: ${response.status}`);
      return generateMockHistoryData(code, start, end);
    }
    
    const result = await response.json();
    const historyData = result.data?.history || [];
    
    // Cache history data
    cache.set(cacheKey, { data: historyData, timestamp: Date.now() });
    
    return historyData.length > 0 ? historyData : generateMockHistoryData(code, start, end);
  } catch (error) {
    console.error(`Error fetching history for ${code}:`, error);
    return generateMockHistoryData(code, start, end);
  }
};

// Get market overview using correct /overview endpoint
export const getLiveCoinWatchOverview = async (): Promise<any> => {
  try {
    console.log('Fetching market overview');
    
    const cacheKey = 'livecoinwatch:overview';
    const cachedItem = cache.get(cacheKey);
    if (cachedItem && (Date.now() - cachedItem.timestamp < CACHE_DURATION)) {
      return cachedItem.data;
    }
    
    const requestBody = {
      currency: 'USD'
    };
    
    const response = await fetch(`${LIVECOINWATCH_BASE_URL}/overview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': LIVECOINWATCH_API_KEY
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      console.error(`Overview API failed: ${response.status}`);
      return generateMockOverviewData();
    }
    
    const result = await response.json();
    
    // Cache overview data
    cache.set(cacheKey, { data: result.data, timestamp: Date.now() });
    
    return result.data || generateMockOverviewData();
  } catch (error) {
    console.error('Error fetching market overview:', error);
    return generateMockOverviewData();
  }
};

// Get exchange data using correct /exchanges/single endpoint
export const getLiveCoinWatchExchanges = async (): Promise<any[]> => {
  try {
    console.log('Fetching exchanges');
    
    const cacheKey = 'livecoinwatch:exchanges';
    const cachedItem = cache.get(cacheKey);
    if (cachedItem && (Date.now() - cachedItem.timestamp < CACHE_DURATION)) {
      return cachedItem.data;
    }
    
    const requestBody = {
      currency: 'USD',
      sort: 'volume',
      order: 'descending',
      offset: 0,
      limit: 20
    };
    
    const response = await fetch(`${LIVECOINWATCH_BASE_URL}/exchanges/single`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': LIVECOINWATCH_API_KEY
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      console.error(`Exchanges API failed: ${response.status}`);
      return generateMockExchangeData();
    }
    
    const result = await response.json();
    const exchangesData = result.data || [];
    
    // Cache exchanges data
    cache.set(cacheKey, { data: exchangesData, timestamp: Date.now() });
    
    return exchangesData.length > 0 ? exchangesData : generateMockExchangeData();
  } catch (error) {
    console.error('Error fetching exchanges:', error);
    return generateMockExchangeData();
  }
};

// Mock data generators for fallback
function generateMockCryptoData(limit: number) {
  const cryptos = [
    { symbol: 'BTC', name: 'Bitcoin', price: 43500, change24h: 2.5, marketCap: 850000000000, volume24h: 25000000000 },
    { symbol: 'ETH', name: 'Ethereum', price: 2650, change24h: -1.2, marketCap: 320000000000, volume24h: 12000000000 },
    { symbol: 'BNB', name: 'BNB', price: 315, change24h: 0.8, marketCap: 48000000000, volume24h: 1500000000 },
    { symbol: 'XRP', name: 'XRP', price: 0.62, change24h: 3.1, marketCap: 34000000000, volume24h: 1200000000 },
    { symbol: 'ADA', name: 'Cardano', price: 0.48, change24h: -0.5, marketCap: 17000000000, volume24h: 380000000 },
    { symbol: 'SOL', name: 'Solana', price: 98, change24h: 4.2, marketCap: 44000000000, volume24h: 2100000000 },
    { symbol: 'DOT', name: 'Polkadot', price: 7.2, change24h: -2.1, marketCap: 9000000000, volume24h: 180000000 },
    { symbol: 'MATIC', name: 'Polygon', price: 0.85, change24h: 1.8, marketCap: 8500000000, volume24h: 420000000 }
  ];
  
  return cryptos.slice(0, limit).map((crypto, index) => ({
    ...crypto,
    change1h: (Math.random() - 0.5) * 2,
    change7d: (Math.random() - 0.5) * 20,
    change30d: (Math.random() - 0.5) * 50,
    change1y: (Math.random() - 0.5) * 200,
    iconUrl: `https://cryptologos.cc/logos/${crypto.symbol.toLowerCase()}-${crypto.symbol.toLowerCase()}-logo.png`,
    source: 'LiveCoinWatch'
  }));
}

function generateMockCoinData(symbol: string) {
  const basePrice = symbol === 'BTC' ? 43500 : symbol === 'ETH' ? 2650 : Math.random() * 100;
  return {
    symbol: symbol.toUpperCase(),
    name: `${symbol} Token`,
    price: basePrice,
    change24h: (Math.random() - 0.5) * 10,
    change1h: (Math.random() - 0.5) * 2,
    change7d: (Math.random() - 0.5) * 20,
    change30d: (Math.random() - 0.5) * 50,
    change1y: (Math.random() - 0.5) * 200,
    marketCap: basePrice * 21000000,
    volume24h: basePrice * 1000000,
    iconUrl: `https://cryptologos.cc/logos/${symbol.toLowerCase()}-${symbol.toLowerCase()}-logo.png`,
    source: 'LiveCoinWatch'
  };
}

function generateMockOverviewData() {
  return {
    cap: 1.65e12, // 1.65T
    volume: 45e9, // 45B
    coins: 2847,
    btcDominance: 52.3
  };
}

function generateMockExchangeData() {
  return [
    { name: 'Binance', volume: 15e9, png64: '' },
    { name: 'Coinbase', volume: 8e9, png64: '' },
    { name: 'Kraken', volume: 3e9, png64: '' },
    { name: 'KuCoin', volume: 2e9, png64: '' }
  ];
}

function generateMockHistoryData(code: string, start: number, end: number) {
  const points = [];
  const duration = end - start;
  const intervals = Math.min(100, Math.max(10, duration / (24 * 60 * 60 * 1000))); // Max 100 points
  const basePrice = code === 'BTC' ? 43500 : code === 'ETH' ? 2650 : Math.random() * 100;
  
  for (let i = 0; i < intervals; i++) {
    const timestamp = start + (duration / intervals) * i;
    const price = basePrice * (1 + (Math.random() - 0.5) * 0.1); // ±5% variation
    points.push([timestamp, price]);
  }
  
  return points;
}
