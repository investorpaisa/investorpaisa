
import { fetchProxyData } from '../api';
import { toast } from 'sonner';

/**
 * Search for stocks by query
 */
export async function searchStocks(query: string): Promise<Array<{symbol: string; name: string; type: string}>> {
  try {
    const data = await fetchProxyData('search', { query }) as Array<{symbol: string; name: string; type: string}>;
    return data || [];
  } catch (error) {
    console.error(`Error searching stocks for "${query}":`, error);
    toast.error('Failed to search stocks');
    return [];
  }
}
