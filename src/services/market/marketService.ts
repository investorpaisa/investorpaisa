
import { StockQuote, MarketStatus, MarketIndex } from '@/services/messages/types';
import { toast } from 'sonner';
import { fetchProxyData } from './apiProxy';

// Market indices supported by NSE
export const NSE_INDICES = {
  NIFTY_50: 'NIFTY 50',
  NIFTY_BANK: 'NIFTY BANK',
  NIFTY_IT: 'NIFTY IT',
  NIFTY_AUTO: 'NIFTY AUTO',
  NIFTY_PHARMA: 'NIFTY PHARMA',
  NIFTY_FMCG: 'NIFTY FMCG'
};

/**
 * Get current market status
 */
export async function getMarketStatus(): Promise<MarketStatus> {
  try {
    const data = await fetchProxyData('/marketStatus') as { 
      marketState: string; 
      marketStatus: string; 
    };
    
    return {
      status: data.marketState.toLowerCase() as 'open' | 'closed' | 'pre-open' | 'post-close',
      message: data.marketStatus || 'Status information not available',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching market status:', error);
    toast.error('Failed to fetch market status');
    throw error;
  }
}

/**
 * Get stock quote for a given symbol
 */
export async function getStockQuote(symbol: string): Promise<StockQuote> {
  try {
    const data = await fetchProxyData('/quote', { symbol }) as {
      info: { symbol: string; companyName: string; industry: string; series: string };
      priceInfo: { 
        lastPrice: number; change: number; pChange: number; open: number; close: number; 
        previousClose: number; intraDayHighLow: { min: number; max: number }
      };
      securityInfo: { tradedVolume: number };
    };
    
    return {
      symbol: data.info.symbol,
      companyName: data.info.companyName,
      lastPrice: data.priceInfo.lastPrice,
      change: data.priceInfo.change,
      pChange: data.priceInfo.pChange,
      open: data.priceInfo.open,
      high: data.priceInfo.intraDayHighLow.max,
      low: data.priceInfo.intraDayHighLow.min,
      close: data.priceInfo.close,
      previousClose: data.priceInfo.previousClose,
      volume: data.securityInfo.tradedVolume || 0,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error fetching stock quote for ${symbol}:`, error);
    toast.error(`Failed to fetch data for ${symbol}`);
    throw error;
  }
}

/**
 * Get index data for a given index
 */
export async function getIndexData(indexName: string): Promise<MarketIndex> {
  try {
    const data = await fetchProxyData('/indexData', { index: indexName }) as {
      indexInfo: { name: string };
      last: number;
      open: number;
      high: number;
      low: number;
      previousClose: number;
      change: number;
      percentChange: number;
    };
    
    return {
      name: data.indexInfo.name,
      lastPrice: data.last,
      change: data.change,
      pChange: data.percentChange,
      open: data.open,
      high: data.high,
      low: data.low,
      previousClose: data.previousClose,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error fetching index data for ${indexName}:`, error);
    toast.error(`Failed to fetch data for ${indexName}`);
    throw error;
  }
}

/**
 * Get top gainers of the day
 */
export async function getTopGainers(): Promise<StockQuote[]> {
  try {
    const data = await fetchProxyData('/marketData/topGainers') as Array<{
      symbol: string;
      lastPrice: number;
      change: number;
      pChange: number;
      open?: number;
      high?: number;
      low?: number;
      previousClose?: number;
      tradedQuantity?: number;
    }>;
    
    return data.map((item) => ({
      symbol: item.symbol,
      companyName: item.symbol,
      lastPrice: item.lastPrice,
      change: item.change,
      pChange: item.pChange,
      open: item.open || 0,
      high: item.high || item.lastPrice,
      low: item.low || item.lastPrice,
      close: item.previousClose || 0,
      previousClose: item.previousClose || 0,
      volume: item.tradedQuantity || 0,
      timestamp: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error fetching top gainers:', error);
    toast.error('Failed to fetch top gainers');
    throw error;
  }
}

/**
 * Get top losers of the day
 */
export async function getTopLosers(): Promise<StockQuote[]> {
  try {
    const data = await fetchProxyData('/marketData/topLosers') as Array<{
      symbol: string;
      lastPrice: number;
      change: number;
      pChange: number;
      open?: number;
      high?: number;
      low?: number;
      previousClose?: number;
      tradedQuantity?: number;
    }>;
    
    return data.map((item) => ({
      symbol: item.symbol,
      companyName: item.symbol,
      lastPrice: item.lastPrice,
      change: item.change,
      pChange: item.pChange,
      open: item.open || 0,
      high: item.high || item.lastPrice,
      low: item.low || item.lastPrice,
      close: item.previousClose || 0,
      previousClose: item.previousClose || 0,
      volume: item.tradedQuantity || 0,
      timestamp: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error fetching top losers:', error);
    toast.error('Failed to fetch top losers');
    throw error;
  }
}

/**
 * Search stocks by name or symbol
 */
export async function searchStocks(query: string): Promise<StockQuote[]> {
  try {
    const data = await fetchProxyData('/search', { q: query }) as Array<{
      symbol: string;
      name: string;
      type: string;
    }>;
    
    // For each stock found in search, get its quote data
    const stocks = await Promise.all(
      data.map(async (item) => {
        try {
          // In a real implementation, we would batch these requests
          // For the mock, we'll just simulate individual quotes
          const quoteData = await fetchProxyData('/quote', { symbol: item.symbol }) as {
            priceInfo: { 
              lastPrice: number; change: number; pChange: number; open: number; close: number; 
              previousClose: number; intraDayHighLow: { min: number; max: number }
            };
            securityInfo: { tradedVolume: number };
          };
          
          return {
            symbol: item.symbol,
            companyName: item.name,
            lastPrice: quoteData.priceInfo.lastPrice,
            change: quoteData.priceInfo.change,
            pChange: quoteData.priceInfo.pChange,
            open: quoteData.priceInfo.open,
            high: quoteData.priceInfo.intraDayHighLow.max,
            low: quoteData.priceInfo.intraDayHighLow.min,
            close: quoteData.priceInfo.close,
            previousClose: quoteData.priceInfo.previousClose,
            volume: quoteData.securityInfo.tradedVolume || 0,
            timestamp: new Date().toISOString()
          };
        } catch (error) {
          console.error(`Error fetching quote for ${item.symbol}:`, error);
          return null;
        }
      })
    );
    
    return stocks.filter((stock): stock is StockQuote => stock !== null);
  } catch (error) {
    console.error('Error searching stocks:', error);
    toast.error('Failed to search stocks');
    throw error;
  }
}
