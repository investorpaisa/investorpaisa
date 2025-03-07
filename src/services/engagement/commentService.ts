
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Comment, CommentInsert, CommentUpdate } from '@/types';

export const commentService = {
  /**
   * Add a comment to a post
   */
  async addComment(postId: string, content: string, parentId?: string): Promise<Comment | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to comment",
          variant: "destructive"
        });
        return null;
      }

      const userId = user.user.id;

      const newComment: CommentInsert = {
        post_id: postId,
        user_id: userId,
        content,
        parent_id: parentId || null
      };

      const { data, error } = await supabase
        .from('comments')
        .insert(newComment)
        .select('*')
        .single();

      if (error) throw error;
      
      // Call the increment_comments function to update post comment count
      if (!parentId) {
        await supabase.rpc('increment_comments', { post_id: postId });
      }
      
      return data;
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  },

  /**
   * Update a comment
   */
  async updateComment(commentId: string, content: string): Promise<Comment | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to update comments",
          variant: "destructive"
        });
        return null;
      }

      const updateData: CommentUpdate = {
        content,
        edited: true
      };

      const { data, error } = await supabase
        .from('comments')
        .update(updateData)
        .eq('id', commentId)
        .eq('user_id', user.user.id)
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating comment:', error);
      toast({
        title: "Error",
        description: "Failed to update comment. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  },

  /**
   * Delete a comment
   */
  async deleteComment(commentId: string, postId: string): Promise<boolean> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to delete comments",
          variant: "destructive"
        });
        return false;
      }

      // Get comment to check if it's a top-level comment
      const { data: comment } = await supabase
        .from('comments')
        .select('parent_id')
        .eq('id', commentId)
        .single();

      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.user.id);

      if (error) throw error;
      
      // Decrement comment count only if it's a top-level comment
      if (comment && comment.parent_id === null) {
        await supabase.rpc('decrement_comments', { post_id: postId });
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Error",
        description: "Failed to delete comment. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  },

  /**
   * Get comments for a post
   */
  async getPostComments(postId: string): Promise<Comment[]> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          author:user_id(
            id,
            full_name,
            username,
            avatar_url,
            role
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Organize comments into hierarchy (parent comments and replies)
      const commentMap = new Map<string, Comment>();
      const topLevelComments: Comment[] = [];

      // First pass: add all comments to the map
      data.forEach(comment => {
        commentMap.set(comment.id, { ...comment, replies: [] });
      });

      // Second pass: organize into parent-child relationships
      data.forEach(comment => {
        const processedComment = commentMap.get(comment.id)!;
        
        if (comment.parent_id) {
          // This is a reply, add it to its parent's replies
          const parent = commentMap.get(comment.parent_id);
          if (parent && parent.replies) {
            parent.replies.push(processedComment);
          }
        } else {
          // This is a top-level comment
          topLevelComments.push(processedComment);
        }
      });

      return topLevelComments;
    } catch (error) {
      console.error('Error getting post comments:', error);
      return [];
    }
  }
};
