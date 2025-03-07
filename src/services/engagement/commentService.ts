
import { supabase } from '@/integrations/supabase/client';
import { Comment, CommentInsert, CommentUpdate } from '@/types';
import { buildCommentTree } from './utils';

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
      author:user_id (
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

  return data as Comment;
};

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

  // Build comment tree - pass as any[] to avoid type issues with buildCommentTree
  const commentTree = buildCommentTree(data as any[]);

  return commentTree;
};
