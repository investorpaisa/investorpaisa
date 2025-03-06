
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Comment, Post } from '@/services/api';

export const postService = {
  async unlikePost(postId: string): Promise<boolean> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error("You must be logged in to unlike a post");
      }
      
      // Check if user already liked the post
      const { data: existingLike, error: checkError } = await supabase
        .from('likes')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', userData.user.id)
        .maybeSingle();
        
      if (checkError) {
        throw checkError;
      }
      
      if (!existingLike) {
        // User hasn't liked this post, nothing to unlike
        return false;
      }
      
      // Remove the like
      const { error: deleteError } = await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userData.user.id);
        
      if (deleteError) {
        throw deleteError;
      }
      
      // Decrement the likes count in the post
      const { error: updateError } = await supabase
        .rpc('decrement_likes', { post_id: postId });
        
      if (updateError) {
        console.error("Error decrementing likes count:", updateError);
        // We already removed the like, so we consider this a success
      }
      
      return true;
    } catch (error) {
      console.error(`Error unliking post ${postId}:`, error);
      toast({
        title: "Failed to unlike post",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  },

  async likePost(postId: string): Promise<boolean> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error("You must be logged in to like a post");
      }
      
      // Check if user already liked the post
      const { data: existingLike, error: checkError } = await supabase
        .from('likes')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', userData.user.id)
        .maybeSingle();
        
      if (checkError) {
        throw checkError;
      }
      
      if (existingLike) {
        // User already liked this post
        return false;
      }
      
      // Add the like
      const { error: insertError } = await supabase
        .from('likes')
        .insert({
          post_id: postId,
          user_id: userData.user.id
        });
        
      if (insertError) {
        throw insertError;
      }
      
      // Increment the likes count in the post
      const { error: updateError } = await supabase
        .rpc('increment_likes', { post_id: postId });
        
      if (updateError) {
        console.error("Error incrementing likes count:", updateError);
        // We already added the like, so we consider this a success
      }
      
      return true;
    } catch (error) {
      console.error(`Error liking post ${postId}:`, error);
      toast({
        title: "Failed to like post",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  },

  async createComment(postId: string, content: string): Promise<Comment | null> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error("You must be logged in to comment on a post");
      }
      
      // Create the comment
      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: userData.user.id,
          content
        })
        .select(`
          *,
          user:user_id(*)
        `)
        .single();
        
      if (error) {
        throw error;
      }
      
      // Increment the comment count in the post
      const { error: updateError } = await supabase
        .rpc('increment_comments', { post_id: postId });
        
      if (updateError) {
        console.error("Error incrementing comment count:", updateError);
        // We already added the comment, so we consider this a success
      }
      
      return {
        id: data.id,
        content: data.content,
        user: {
          id: data.user.id,
          name: data.user.full_name || data.user.username || 'User',
          email: '',
          avatar: data.user.avatar_url,
          role: (data.user.role as 'user' | 'expert') || 'user',
          followers: data.user.followers || 0,
          following: data.user.following || 0,
          joined: new Date(data.user.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        },
        createdAt: new Date(data.created_at).toISOString()
      };
    } catch (error) {
      console.error(`Error creating comment on post ${postId}:`, error);
      toast({
        title: "Failed to post comment",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      return null;
    }
  }
};
