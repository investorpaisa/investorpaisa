
import { supabase } from '@/integrations/supabase/client';
import { Comment, CommentUpdate } from '@/types';

/**
 * Update an existing comment
 */
export const updateComment = async (id: string, updates: CommentUpdate): Promise<Comment> => {
  const { data, error } = await supabase
    .from('comments')
    .update(updates)
    .eq('id', id)
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
    console.error('Error updating comment:', error);
    throw new Error(`Failed to update comment: ${error.message}`);
  }

  return {
    ...data,
    author: data.profiles
  } as Comment;
};
