import { supabase } from '@/integrations/supabase/client';
import { PostShare, PostShareInsert, ShareType } from '@/types';

/**
 * Share a post
 */
export const sharePost = async (share: PostShareInsert): Promise<PostShare> => {
  try {
    const { data, error } = await supabase
      .from('post_shares')
      .insert(share)
      .select('*')
      .single();

    if (error) {
      console.error('Error sharing post:', error);
      throw new Error(`Failed to share post: ${error.message}`);
    }

    return data as PostShare;
  } catch (error) {
    console.error('Error in sharePost:', error);
    throw error;
  }
};

/**
 * Get shares for a post
 */
export const getPostShares = async (postId: string): Promise<PostShare[]> => {
  try {
    const { data, error } = await supabase
      .from('post_shares')
      .select('*')
      .eq('post_id', postId);

    if (error) {
      console.error('Error fetching post shares:', error);
      throw new Error(`Failed to fetch post shares: ${error.message}`);
    }

    // Ensure share_type is of the correct type
    const typedShares = data.map(share => ({
      ...share,
      share_type: share.share_type as 'user' | 'circle' | 'public'
    }));

    return typedShares as PostShare[];
  } catch (error) {
    console.error('Error in getPostShares:', error);
    throw error;
  }
};

/**
 * Get shares for a user
 */
export const getUserShares = async (userId: string): Promise<PostShare[]> => {
  try {
    const { data, error } = await supabase
      .from('post_shares')
      .select('*, sharer:profiles(*)')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user shares:', error);
      throw new Error(`Failed to fetch user shares: ${error.message}`);
    }

    // Ensure share_type is of the correct type
    const typedShares = data.map(share => ({
      ...share,
      share_type: share.share_type as 'user' | 'circle' | 'public'
    }));

    return typedShares as PostShare[];
  } catch (error) {
    console.error('Error in getUserShares:', error);
    throw error;
  }
};

/**
 * Delete a share
 */
export const deleteShare = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('post_shares')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting share:', error);
      throw new Error(`Failed to delete share: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in deleteShare:', error);
    throw error;
  }
};
