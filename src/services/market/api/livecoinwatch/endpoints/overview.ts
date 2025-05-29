
import { LIVECOINWATCH_API_KEY, LIVECOINWATCH_BASE_URL } from '../constants';
import { getCachedData, setCachedData, generateMockOverviewData } from '../utils';

export const getLiveCoinWatchOverview = async (): Promise<any> => {
  try {
    console.log('Fetching market overview');
    
    const cacheKey = 'livecoinwatch:overview';
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
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
    setCachedData(cacheKey, result.data);
    
    return result.data || generateMockOverviewData();
  } catch (error) {
    console.error('Error fetching market overview:', error);
    return generateMockOverviewData();
  }
};
