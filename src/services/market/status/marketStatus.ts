
import { MarketStatus } from '@/services/messages/types';
import { toast } from 'sonner';
import { fetchProxyData } from '../api';

/**
 * Get current market status
 */
export async function getMarketStatus(): Promise<MarketStatus> {
  try {
    const data = await fetchProxyData('marketStatus') as { 
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
