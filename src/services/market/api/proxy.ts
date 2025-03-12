
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Simple in-memory cache to reduce API calls
const cache = new Map<string, { data: any, timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Core proxy function to call the Supabase Edge Function
export const fetchProxyData = async (endpoint: string, params: Record<string, string> = {}) => {
  try {
    console.log(`Fetching ${endpoint} with params:`, params);
    
    // Generate a cache key based on endpoint and params
    const cacheKey = `${endpoint}:${JSON.stringify(params)}`;
    
    // Check if we have cached data
    const cachedItem = cache.get(cacheKey);
    if (cachedItem && (Date.now() - cachedItem.timestamp < CACHE_DURATION)) {
      console.log(`Using cached data for ${endpoint}`);
      return cachedItem.data;
    }
    
    // Call the Supabase Edge Function with the endpoint and params
    const { data, error } = await supabase.functions.invoke('fetch-nse-data', {
      body: { endpoint, params },
    });
    
    if (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      toast.error(`Failed to fetch market data: ${error.message}`);
      return null;
    }
    
    if (!data) {
      console.warn(`No data returned for ${endpoint}`);
      toast.error('No market data available');
      return null;
    }
    
    console.log(`Data received for ${endpoint}:`, data);
    
    // If data indicates it's fallback, show a subtle toast
    if (data.isFallback) {
      toast.info('Using estimated market data due to API limits');
    }
    
    // Cache the successful result
    cache.set(cacheKey, { data, timestamp: Date.now() });
    
    return data;
  } catch (error) {
    console.error(`Exception fetching ${endpoint}:`, error);
    toast.error(`Failed to fetch market data: ${(error as Error).message}`);
    return null;
  }
};
