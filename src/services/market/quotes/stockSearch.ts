
import { StockQuote } from '@/services/messages/types';
import { toast } from 'sonner';
import { fetchProxyData } from '../apiProxy';

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
