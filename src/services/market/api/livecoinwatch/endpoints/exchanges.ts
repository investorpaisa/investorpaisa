
import { LIVECOINWATCH_API_KEY, LIVECOINWATCH_BASE_URL } from '../constants';
import { getCachedData, setCachedData, generateMockExchangeData } from '../utils';

export const getLiveCoinWatchExchanges = async (): Promise<any[]> => {
  try {
    console.log('Fetching exchanges');
    
    const cacheKey = 'livecoinwatch:exchanges';
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
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
    setCachedData(cacheKey, exchangesData);
    
    return exchangesData.length > 0 ? exchangesData : generateMockExchangeData();
  } catch (error) {
    console.error('Error fetching exchanges:', error);
    return generateMockExchangeData();
  }
};
