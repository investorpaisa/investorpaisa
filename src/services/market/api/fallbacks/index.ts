
// Export all fallback data generators
import { mockMarketStatus } from './marketStatus';
import { mockIndexData } from './indices';
import { mockStockQuote } from './stocks';
import { mockTopGainers, mockTopLosers } from './performers';
import { mockSearchResults } from './search';

// Fallback data when the API fails
export function getFallbackData(endpoint: string, params: Record<string, string> = {}) {
  console.log(`Using fallback data for ${endpoint}`);
  
  switch (endpoint) {
    case 'marketStatus':
      return mockMarketStatus();
    case 'indices':
      return mockIndexData(params.index);
    case 'stocks':
      return mockStockQuote(params.symbol);
    case 'gainers':
      return mockTopGainers();
    case 'losers':
      return mockTopLosers();
    case 'search':
      return mockSearchResults(params.q);
    default:
      return { error: "Unsupported endpoint" };
  }
}
