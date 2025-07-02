
import { supabase } from '@/integrations/supabase/client';

export interface CommentUpdate {
  content?: string;
  likes?: number;
}

export interface Comment {
  id: string;
  content: string;
  post_id: string;
  user_id: string;
  parent_id?: string;
  likes: number;
  created_at: string;
  updated_at: string;
  author: {
    id: string;
    full_name: string;
    username: string;
    avatar_url: string;
  };
}

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
        avatar_url
      )
    `)
    .single();

  if (error) {
    console.error('Error updating comment:', error);
    throw new Error(`Failed to update comment: ${error.message}`);
  }

  return {
    ...data,
    author: {
      id: data.profiles.id,
      full_name: data.profiles.full_name,
      username: data.profiles.username,
      avatar_url: data.profiles.avatar_url
    }
  } as Comment;
};
