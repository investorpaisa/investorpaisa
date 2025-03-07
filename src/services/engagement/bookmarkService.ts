
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Bookmark, BookmarkInsert, Post } from '@/types';

export const bookmarkService = {
  /**
   * Toggle bookmark status for a post
   */
  async toggleBookmark(postId: string): Promise<boolean> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to bookmark posts",
          variant: "destructive"
        });
        return false;
      }

      const userId = user.user.id;

      // Check if post is already bookmarked
      const { data: existingBookmark } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single();

      if (existingBookmark) {
        // Remove bookmark
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('id', existingBookmark.id);

        if (error) throw error;
        return false;
      } else {
        // Add bookmark
        const newBookmark: BookmarkInsert = {
          post_id: postId,
          user_id: userId
        };

        const { error } = await supabase
          .from('bookmarks')
          .insert(newBookmark);

        if (error) throw error;
        return true;
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to bookmark the post. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  },

  /**
   * Check if a post is bookmarked by the current user
   */
  async isPostBookmarked(postId: string): Promise<boolean> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return false;

      const userId = user.user.id;

      const { data } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single();

      return !!data;
    } catch (error) {
      console.error('Error checking if post is bookmarked:', error);
      return false;
    }
  },

  /**
   * Get all bookmarked posts for the current user
   */
  async getBookmarkedPosts(): Promise<Post[]> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to view bookmarks",
          variant: "destructive"
        });
        return [];
      }

      const { data, error } = await supabase
        .from('bookmarks')
        .select(`
          post_id,
          posts:post_id(
            *,
            author:user_id(
              id,
              full_name,
              username,
              avatar_url,
              role
            ),
            category:category_id(
              id,
              name,
              icon
            )
          )
        `)
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Extract the posts from the joined data
      return data.map(item => item.posts) || [];
    } catch (error) {
      console.error('Error getting bookmarked posts:', error);
      return [];
    }
  }
};
