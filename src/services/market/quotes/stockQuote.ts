
import { StockQuote } from '@/services/messages/types';
import { toast } from 'sonner';
import { fetchProxyData } from '../apiProxy';

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
