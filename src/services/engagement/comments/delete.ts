
import { supabase } from '@/integrations/supabase/client';

/**
 * Delete a comment
 */
export const deleteComment = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting comment:', error);
    throw new Error(`Failed to delete comment: ${error.message}`);
  }
};
