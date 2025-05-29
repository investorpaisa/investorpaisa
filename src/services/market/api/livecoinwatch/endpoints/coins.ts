
import { LIVECOINWATCH_API_KEY, LIVECOINWATCH_BASE_URL } from '../constants';
import { getCachedData, setCachedData, generateMockCryptoData, generateMockCoinData } from '../utils';
import { LiveCoinWatchCoin } from '../types';

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
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      console.log('Using cached data');
      return cachedData;
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
    setCachedData(cacheKey, transformedData);
    
    return transformedData;
    
  } catch (error) {
    console.error('Error fetching LiveCoinWatch data:', error);
    return generateMockCryptoData(limit);
  }
};

export const getLiveCoinWatchCoin = async (code: string): Promise<any | null> => {
  try {
    console.log(`Fetching data for ${code}`);
    
    const cacheKey = `livecoinwatch:coin:${code.toUpperCase()}`;
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
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
    
    setCachedData(cacheKey, transformedData);
    return transformedData;
    
  } catch (error) {
    console.error(`Error searching for ${code}:`, error);
    return generateMockCoinData(code);
  }
};
