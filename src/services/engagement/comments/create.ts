
import { supabase } from '@/integrations/supabase/client';
import { Comment, CommentInsert } from '@/types';

/**
 * Create a new comment
 */
export const createComment = async (comment: CommentInsert): Promise<Comment> => {
  const { data, error } = await supabase
    .from('comments')
    .insert(comment)
    .select(`
      *,
      author:user_id (
        id,
        full_name,
        username,
        avatar_url
      )
    `)
    .single();

  if (error) {
    console.error('Error creating comment:', error);
    throw new Error(`Failed to create comment: ${error.message}`);
  }

  return data as Comment;
};
