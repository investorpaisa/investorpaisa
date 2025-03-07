
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { PostShare, PostShareInsert, ShareType } from '@/types';

export const shareService = {
  /**
   * Share a post
   */
  async sharePost(
    postId: string, 
    shareType: ShareType, 
    targetId?: string, 
    commentary?: string
  ): Promise<PostShare | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to share posts",
          variant: "destructive"
        });
        return null;
      }

      const newShare: PostShareInsert = {
        post_id: postId,
        user_id: user.user.id,
        share_type: shareType,
        target_id: targetId || null,
        commentary: commentary || null
      };

      const { data, error } = await supabase
        .from('post_shares')
        .insert(newShare)
        .select('*')
        .single();

      if (error) throw error;
      
      let successMessage = "Post shared successfully";
      if (shareType === 'user') {
        successMessage = "Post shared with user";
      } else if (shareType === 'circle') {
        successMessage = "Post shared with circle";
      }
      
      toast({
        title: "Success",
        description: successMessage
      });
      
      return data;
    } catch (error) {
      console.error('Error sharing post:', error);
      toast({
        title: "Error",
        description: "Failed to share the post. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  },

  /**
   * Get shares for a post
   */
  async getPostShares(postId: string): Promise<PostShare[]> {
    try {
      const { data, error } = await supabase
        .from('post_shares')
        .select(`
          *,
          sharer:user_id(
            id,
            full_name,
            username,
            avatar_url
          )
        `)
        .eq('post_id', postId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting post shares:', error);
      return [];
    }
  },

  /**
   * Delete a share
   */
  async deleteShare(shareId: string): Promise<boolean> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to delete shares",
          variant: "destructive"
        });
        return false;
      }

      const { error } = await supabase
        .from('post_shares')
        .delete()
        .eq('id', shareId)
        .eq('user_id', user.user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting share:', error);
      toast({
        title: "Error",
        description: "Failed to delete share. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  }
};
