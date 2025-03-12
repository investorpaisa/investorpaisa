
// Export all API functionality
import { fetchProxyData } from './proxy';
import { getFallbackData } from './fallbacks';

// Public API for making requests to the market data service
export async function fetchMarketData(endpoint: string, params: Record<string, string> = {}) {
  try {
    // Attempt to fetch data from the edge function
    const data = await fetchProxyData(endpoint, params);
    
    // If no data returned, use fallback
    if (!data) {
      return getFallbackData(endpoint, params);
    }
    
    return data;
  } catch (error) {
    console.error(`Error in fetchMarketData for ${endpoint}:`, error);
    // Return fallback data on any error
    return getFallbackData(endpoint, params);
  }
}

export * from './types';
