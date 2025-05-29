
import { LIVECOINWATCH_API_KEY, LIVECOINWATCH_BASE_URL } from '../constants';
import { getCachedData, setCachedData, generateMockHistoryData } from '../utils';

export const getLiveCoinWatchHistory = async (
  code: string, 
  start: number, 
  end: number
): Promise<number[][]> => {
  try {
    console.log(`Fetching history for ${code}`);
    
    const cacheKey = `livecoinwatch:history:${code}:${start}:${end}`;
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
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
    setCachedData(cacheKey, historyData);
    
    return historyData.length > 0 ? historyData : generateMockHistoryData(code, start, end);
  } catch (error) {
    console.error(`Error fetching history for ${code}:`, error);
    return generateMockHistoryData(code, start, end);
  }
};
