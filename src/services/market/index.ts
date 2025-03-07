
// Re-export all market service functions
import { getMarketStatus } from './status';
import { getStockQuote, searchStocks } from './quotes';
import { getIndexData, NSE_INDICES } from './indices';
import { getTopGainers, getTopLosers } from './market-data';

// Export individual functions
export {
  getMarketStatus,
  getStockQuote,
  getIndexData,
  getTopGainers,
  getTopLosers,
  searchStocks,
  NSE_INDICES
};

// Export as a service object for backward compatibility
export const marketService = {
  getMarketStatus,
  getStockQuote,
  getIndexData,
  getTopGainers,
  getTopLosers,
  searchStocks
};
