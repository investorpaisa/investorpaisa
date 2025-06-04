
import { fetchProxyData } from '../api';
import { toast } from 'sonner';

export interface MarketPerformer {
  symbol: string;
  lastPrice: number;
  change: number;
  pChange: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  tradedQuantity: number;
}

/**
 * Get top gaining stocks
 */
export async function getTopGainers(): Promise<MarketPerformer[]> {
  try {
    const data = await fetchProxyData('gainers') as MarketPerformer[];
    return data || [];
  } catch (error) {
    console.error('Error fetching top gainers:', error);
    toast.error('Failed to fetch top gainers');
    return [];
  }
}

/**
 * Get top losing stocks
 */
export async function getTopLosers(): Promise<MarketPerformer[]> {
  try {
    const data = await fetchProxyData('losers') as MarketPerformer[];
    return data || [];
  } catch (error) {
    console.error('Error fetching top losers:', error);
    toast.error('Failed to fetch top losers');
    return [];
  }
}
