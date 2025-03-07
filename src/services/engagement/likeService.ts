
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Like, LikeInsert } from '@/types';

export const likeService = {
  /**
   * Toggle like status for a post
   */
  async toggleLike(postId: string): Promise<boolean> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to like posts",
          variant: "destructive"
        });
        return false;
      }

      const userId = user.user.id;

      // Check if post is already liked
      const { data: existingLike } = await supabase
        .from('likes')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        // Unlike the post
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id);

        if (error) throw error;
        
        // Call the decrement_likes function to update post like count
        await supabase.rpc('decrement_likes', { post_id: postId });
        
        return false;
      } else {
        // Like the post
        const newLike: LikeInsert = {
          post_id: postId,
          user_id: userId
        };

        const { error } = await supabase
          .from('likes')
          .insert(newLike);

        if (error) throw error;
        
        // Call the increment_likes function to update post like count
        await supabase.rpc('increment_likes', { post_id: postId });
        
        return true;
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to like the post. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  },

  /**
   * Check if a post is liked by the current user
   */
  async isPostLiked(postId: string): Promise<boolean> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return false;

      const userId = user.user.id;

      const { data } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single();

      return !!data;
    } catch (error) {
      console.error('Error checking if post is liked:', error);
      return false;
    }
  },

  /**
   * Get all likes for a post
   */
  async getPostLikes(postId: string): Promise<Like[]> {
    try {
      const { data, error } = await supabase
        .from('likes')
        .select('*')
        .eq('post_id', postId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting post likes:', error);
      return [];
    }
  }
};
