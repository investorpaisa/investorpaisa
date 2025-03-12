
import { MarketIndex } from '@/services/messages/types';
import { toast } from 'sonner';
import { fetchProxyData } from '../api';

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
 * Get index data for a given index
 */
export async function getIndexData(indexName: string): Promise<MarketIndex> {
  try {
    const data = await fetchProxyData('indices', { index: indexName });
    
    if (!data) {
      throw new Error(`Failed to fetch data for ${indexName}`);
    }
    
    // The data structure comes directly from our edge function now
    return {
      name: data.name,
      lastPrice: data.lastPrice,
      change: data.change,
      pChange: data.pChange,
      open: data.open,
      high: data.high,
      low: data.low,
      previousClose: data.previousClose,
      timestamp: data.timestamp || new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error fetching index data for ${indexName}:`, error);
    toast.error(`Failed to fetch data for ${indexName}`);
    throw error;
  }
}
