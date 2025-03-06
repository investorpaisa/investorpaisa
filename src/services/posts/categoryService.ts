
import { supabase } from '@/integrations/supabase/client';
import { Category } from './types';
import { handleError, formatCategoryFromSupabase } from './utils';

export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }

    return data.map(formatCategoryFromSupabase);
  } catch (error) {
    handleError(error, "Failed to load categories");
    return [];
  }
}
