
import { supabase } from '@/integrations/supabase/client';

export interface CommentInsert {
  content: string;
  post_id: string;
  user_id: string;
  parent_id?: string;
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
        avatar_url
      )
    `)
    .single();

  if (error) {
    console.error('Error creating comment:', error);
    throw new Error(`Failed to create comment: ${error.message}`);
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
