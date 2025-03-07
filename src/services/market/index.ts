
// Import all market-related functions
import { 
  getMarketStatus,
  getMarketIndices,
  getStockQuote,
  searchStocks 
} from './marketService';

// Export individual functions
export {
  getMarketStatus,
  getMarketIndices,
  getStockQuote,
  searchStocks
};

// Export as a service object for backward compatibility
export const marketService = {
  getMarketStatus,
  getMarketIndices,
  getStockQuote,
  searchStocks
};
