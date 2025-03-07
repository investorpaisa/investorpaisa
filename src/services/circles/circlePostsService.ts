
import { supabase } from '@/integrations/supabase/client';
import { CirclePost, EnhancedPost, CircleRole } from './types';

/**
 * Add a post to a circle
 */
const addPostToCircle = async (circleId: string, postId: string, isPinned = false): Promise<CirclePost> => {
  // Check if the current user is a member of the circle
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error('User not authenticated');
  }

  const userId = userData.user.id;

  const { data: membershipData } = await supabase
    .from('circle_members')
    .select('*')
    .eq('circle_id', circleId)
    .eq('user_id', userId)
    .maybeSingle();

  if (!membershipData) {
    throw new Error('You must be a member of the circle to add posts');
  }

  // Check if the post is already in the circle
  const { data: existingPostData } = await supabase
    .from('circle_posts')
    .select('*')
    .eq('circle_id', circleId)
    .eq('post_id', postId)
    .maybeSingle();

  if (existingPostData) {
    // If it exists and only the pin status is changing, update it
    if (existingPostData.is_pinned !== isPinned) {
      const { data, error } = await supabase
        .from('circle_posts')
        .update({ is_pinned: isPinned })
        .eq('id', existingPostData.id)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating post pin status:', error);
        throw new Error(`Failed to update post pin status: ${error.message}`);
      }

      return data as unknown as CirclePost;
    }
    
    return existingPostData as CirclePost;
  }

  // Add new post to circle
  const { data, error } = await supabase
    .from('circle_posts')
    .insert({
      circle_id: circleId,
      post_id: postId,
      is_pinned: isPinned
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error adding post to circle:', error);
    throw new Error(`Failed to add post to circle: ${error.message}`);
  }

  return data as unknown as CirclePost;
};

/**
 * Get posts from a circle
 */
const getCirclePosts = async (circleId: string): Promise<EnhancedPost[]> => {
  const { data, error } = await supabase
    .from('circle_posts')
    .select('*, post:posts(*)')
    .eq('circle_id', circleId);

  if (error) {
    console.error('Error fetching circle posts:', error);
    throw new Error(`Failed to fetch circle posts: ${error.message}`);
  }

  // Extract posts and add is_pinned flag
  const posts = data.map(item => {
    return {
      ...item.post,
      is_pinned: item.is_pinned
    } as EnhancedPost;
  });

  return posts;
};

/**
 * Toggle pin status of a post in a circle
 */
const togglePostPin = async (circleId: string, postId: string): Promise<CirclePost> => {
  // Check if the current user has admin/co-admin rights
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error('User not authenticated');
  }

  const userId = userData.user.id;

  const { data: userRole } = await supabase
    .from('circle_members')
    .select('role')
    .eq('circle_id', circleId)
    .eq('user_id', userId)
    .single();

  if (!userRole || (userRole.role !== CircleRole.ADMIN && userRole.role !== CircleRole.CO_ADMIN)) {
    throw new Error('You do not have permission to pin or unpin posts');
  }

  // Get current pin status
  const { data: postData } = await supabase
    .from('circle_posts')
    .select('*')
    .eq('circle_id', circleId)
    .eq('post_id', postId)
    .single();

  if (!postData) {
    throw new Error('Post not found in this circle');
  }

  // Toggle pin status
  const { data, error } = await supabase
    .from('circle_posts')
    .update({ is_pinned: !postData.is_pinned })
    .eq('circle_id', circleId)
    .eq('post_id', postId)
    .select('*')
    .single();

  if (error) {
    console.error('Error toggling post pin status:', error);
    throw new Error(`Failed to toggle post pin status: ${error.message}`);
  }

  return data as unknown as CirclePost;
};

/**
 * Remove a post from a circle
 */
const removePostFromCircle = async (circleId: string, postId: string): Promise<boolean> => {
  // Check if the current user has admin/co-admin rights or is the post author
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error('User not authenticated');
  }

  const userId = userData.user.id;

  // Check user's role in the circle
  const { data: userRole } = await supabase
    .from('circle_members')
    .select('role')
    .eq('circle_id', circleId)
    .eq('user_id', userId)
    .maybeSingle();

  // Check if user is the post author
  const { data: postData } = await supabase
    .from('posts')
    .select('user_id')
    .eq('id', postId)
    .maybeSingle();

  const isAdmin = userRole && (userRole.role === CircleRole.ADMIN || userRole.role === CircleRole.CO_ADMIN);
  const isAuthor = postData && postData.user_id === userId;

  if (!isAdmin && !isAuthor) {
    throw new Error('You do not have permission to remove this post');
  }

  const { error } = await supabase
    .from('circle_posts')
    .delete()
    .eq('circle_id', circleId)
    .eq('post_id', postId);

  if (error) {
    console.error('Error removing post from circle:', error);
    throw new Error(`Failed to remove post from circle: ${error.message}`);
  }

  return true;
};

// Export as a group of functions
export const circlePosts = {
  addPostToCircle,
  getCirclePosts,
  togglePostPin,
  removePostFromCircle
};
