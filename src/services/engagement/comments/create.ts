
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
      profiles:user_id (
        id,
        full_name,
        username,
        avatar_url,
        followers,
        following,
        created_at,
        updated_at,
        role
      )
    `)
    .single();

  if (error) {
    console.error('Error creating comment:', error);
    throw new Error(`Failed to create comment: ${error.message}`);
  }

  return {
    ...data,
    author: data.profiles
  } as Comment;
};
