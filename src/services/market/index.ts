
// Export all market service functionality
export * from './api';
export * from './status';
export * from './quotes';
export * from './indices';
export * from './market-data';

// Export the main service
export { marketService } from './marketService';

// Export NSE_INDICES constant
export { NSE_INDICES } from './marketService';

// Export specific functions with clear names to avoid conflicts
export { 
  getStockQuoteFromService as getStockQuote,
  getIndexDataFromService as getIndexData,
  searchStocksFromService as searchStocks,
  getMarketStatus,
  getTopGainers,
  getTopLosers
} from './marketService';

// Re-export types for convenience
export type { 
  StockQuote, 
  MarketStatus, 
  MarketIndex,
  MarketData,
  MarketPerformer
} from './marketService';
