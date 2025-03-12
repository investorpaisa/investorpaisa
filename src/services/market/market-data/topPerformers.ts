
import { StockQuote } from '@/services/messages/types';
import { toast } from 'sonner';
import { fetchProxyData } from '../api';

/**
 * Get top gainers of the day
 */
export async function getTopGainers(): Promise<StockQuote[]> {
  try {
    const data = await fetchProxyData('gainers') as Array<{
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
    const data = await fetchProxyData('losers') as Array<{
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
