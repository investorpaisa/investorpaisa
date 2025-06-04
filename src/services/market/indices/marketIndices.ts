
import { MarketIndex } from '@/services/messages/types';
import { fetchProxyData } from '../api';
import { toast } from 'sonner';

/**
 * Get index data for a given index name
 */
export async function getIndexData(indexName: string): Promise<MarketIndex> {
  try {
    const data = await fetchProxyData('indices', { index: indexName }) as {
      name: string;
      lastPrice: number;
      change: number;
      pChange: number;
      open: number;
      high: number;
      low: number;
      previousClose: number;
      timestamp: string;
    };
    
    return {
      name: data.name || indexName,
      lastPrice: data.lastPrice || 0,
      change: data.change || 0,
      pChange: data.pChange || 0,
      open: data.open || 0,
      high: data.high || 0,
      low: data.low || 0,
      previousClose: data.previousClose || 0,
      timestamp: data.timestamp || new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error fetching index data for ${indexName}:`, error);
    toast.error(`Failed to fetch data for ${indexName}`);
    throw error;
  }
}
