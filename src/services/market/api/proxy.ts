
// Base proxy functionality for fetching market data
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ProxyParams } from './types';

// Core proxy function to call the Supabase Edge Function
export const fetchProxyData = async (endpoint: string, params: Record<string, string> = {}) => {
  try {
    console.log(`Fetching ${endpoint} with params:`, params);
    
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
      return null;
    }
    
    console.log(`Data received for ${endpoint}:`, data);
    
    return data;
  } catch (error) {
    console.error(`Exception fetching ${endpoint}:`, error);
    toast.error(`Failed to fetch market data: ${(error as Error).message}`);
    return null;
  }
};
