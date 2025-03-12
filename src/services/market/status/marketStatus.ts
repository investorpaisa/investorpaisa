
import { MarketStatus } from '@/services/messages/types';
import { toast } from 'sonner';
import { fetchProxyData } from '../api';

export async function getMarketStatus(): Promise<MarketStatus> {
  try {
    console.log('Fetching market status...');
    const data = await fetchProxyData('marketStatus') as { 
      marketState: string; 
      marketStatus: string;
      timestamp: string;
    };
    
    if (!data) {
      throw new Error('Failed to fetch market status');
    }
    
    console.log('Market status data:', data);
    
    return {
      status: data.marketState as 'open' | 'closed' | 'pre-open' | 'post-close',
      message: data.marketStatus || 'Status information not available',
      timestamp: data.timestamp || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching market status:', error);
    toast.error('Failed to fetch market status');
    throw error;
  }
}
