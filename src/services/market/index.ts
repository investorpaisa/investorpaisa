
// Import all market-related functions from marketService
import { 
  getMarketStatus,
  getStockQuote,
  getIndexData,
  getTopGainers,
  getTopLosers,
  searchStocks,
  NSE_INDICES
} from './marketService';

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
