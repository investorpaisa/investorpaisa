
// Re-export all market service functions
import { getMarketStatus } from './status';
import { getStockQuote, searchStocks } from './quotes';
import { getIndexData, NSE_INDICES } from './indices';
import { getTopGainers, getTopLosers } from './market-data';

// Import types from messages/types
import type { MarketStatus, StockQuote, MarketIndex } from '../messages/types';

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

// Export types needed by components
export type { MarketStatus, StockQuote, MarketIndex };

// Export as a service object for backward compatibility
export const marketService = {
  getMarketStatus,
  getStockQuote,
  getIndexData,
  getTopGainers,
  getTopLosers,
  searchStocks
};
