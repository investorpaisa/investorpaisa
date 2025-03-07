
import { supabase } from '@/integrations/supabase/client';
import { Comment } from '@/types';
import { buildCommentTree } from '../utils';

/**
 * Get all comments for a post
 */
export const getPostComments = async (postId: string): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      author:user_id (
        id,
        full_name,
        username,
        avatar_url
      ),
      replies: comments (
        *,
        author:user_id (
          id,
          full_name,
          username,
          avatar_url
        )
      )
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching comments:', error);
    throw new Error(`Failed to fetch comments: ${error.message}`);
  }

  // Build comment tree
  const commentTree = buildCommentTree(data as any[]);

  return commentTree;
};
