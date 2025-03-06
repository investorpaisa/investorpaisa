
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Post, Comment } from '@/services/api';

export const postService = {
  async getPosts(categoryId?: string): Promise<Post[]> {
    try {
      // Build the query
      let query = supabase
        .from('posts')
        .select(`
          *,
          user:profiles(*),
          category:categories(*)
        `)
        .order('created_at', { ascending: false });
        
      // Add filter if category is specified
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return data.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        likes: post.likes || 0,
        comments: post.comment_count || 0,
        createdAt: post.created_at,
        user: {
          id: post.user.id,
          name: post.user.full_name || post.user.username || 'User',
          email: '',
          avatar: post.user.avatar_url,
          role: (post.user.role as 'user' | 'expert') || 'user',
          followers: post.user.followers || 0,
          following: post.user.following || 0,
          joined: ''
        },
        category: post.category ? {
          id: post.category.id,
          name: post.category.name,
          description: post.category.description || '',
          icon: post.category.icon || '',
          posts: post.category.post_count || 0
        } : null
      }));
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        title: "Failed to load posts",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      return [];
    }
  },
  
  async getPostsByUser(userId: string): Promise<Post[]> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          user:profiles(*),
          category:categories(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      return data.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        likes: post.likes || 0,
        comments: post.comment_count || 0,
        createdAt: post.created_at,
        user: {
          id: post.user.id,
          name: post.user.full_name || post.user.username || 'User',
          email: '',
          avatar: post.user.avatar_url,
          role: (post.user.role as 'user' | 'expert') || 'user',
          followers: post.user.followers || 0,
          following: post.user.following || 0,
          joined: ''
        },
        category: post.category ? {
          id: post.category.id,
          name: post.category.name,
          description: post.category.description || '',
          icon: post.category.icon || '',
          posts: post.category.post_count || 0
        } : null
      }));
    } catch (error) {
      console.error(`Error fetching posts for user ${userId}:`, error);
      toast({
        title: "Failed to load posts",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      return [];
    }
  },
  
  async getPostById(postId: string): Promise<Post | null> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          user:profiles(*),
          category:categories(*)
        `)
        .eq('id', postId)
        .single();
        
      if (error) {
        throw error;
      }
      
      return {
        id: data.id,
        title: data.title,
        content: data.content,
        likes: data.likes || 0,
        comments: data.comment_count || 0,
        createdAt: data.created_at,
        user: {
          id: data.user.id,
          name: data.user.full_name || data.user.username || 'User',
          email: '',
          avatar: data.user.avatar_url,
          role: (data.user.role as 'user' | 'expert') || 'user',
          followers: data.user.followers || 0,
          following: data.user.following || 0,
          joined: ''
        },
        category: data.category ? {
          id: data.category.id,
          name: data.category.name,
          description: data.category.description || '',
          icon: data.category.icon || '',
          posts: data.category.post_count || 0
        } : null
      };
    } catch (error) {
      console.error(`Error fetching post with ID ${postId}:`, error);
      toast({
        title: "Failed to load post",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      return null;
    }
  },
  
  async getComments(postId: string): Promise<Comment[]> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          user:profiles(*)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
        
      if (error) {
        throw error;
      }
      
      return data.map(comment => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.created_at,
        updatedAt: comment.updated_at,
        userId: comment.user.id,
        postId: comment.post_id,
        user: {
          id: comment.user.id,
          name: comment.user.full_name || comment.user.username || 'User',
          avatar: comment.user.avatar_url,
          role: (comment.user.role as 'user' | 'expert') || 'user'
        }
      }));
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      toast({
        title: "Failed to load comments",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      return [];
    }
  },
  
  async unlike(postId: string): Promise<boolean> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error("You must be logged in to unlike posts");
      }
      
      // Delete the like record
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', userData.user.id)
        .eq('post_id', postId);
        
      if (error) {
        throw error;
      }
      
      // Call the RPC function to decrement likes count
      const { error: rpcError } = await supabase.rpc('decrement_likes', { post_id: postId });
      
      if (rpcError) {
        console.error("Error decrementing likes:", rpcError);
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
  
  async like(postId: string): Promise<boolean> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error("You must be logged in to like posts");
      }
      
      // Create the like record
      const { error } = await supabase
        .from('likes')
        .insert({
          user_id: userData.user.id,
          post_id: postId
        });
        
      if (error) {
        throw error;
      }
      
      // Call the RPC function to increment likes count
      const { error: rpcError } = await supabase.rpc('increment_likes', { post_id: postId });
      
      if (rpcError) {
        console.error("Error incrementing likes:", rpcError);
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
  
  async addComment(postId: string, content: string): Promise<Comment | null> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error("You must be logged in to comment on posts");
      }
      
      // Create the comment
      const { data, error } = await supabase
        .from('comments')
        .insert({
          user_id: userData.user.id,
          post_id: postId,
          content
        })
        .select(`
          *,
          user:profiles(*)
        `)
        .single();
        
      if (error) {
        throw error;
      }
      
      // Call the RPC function to increment comment count
      const { error: rpcError } = await supabase.rpc('increment_comments', { post_id: postId });
      
      if (rpcError) {
        console.error("Error incrementing comment count:", rpcError);
      }
      
      return {
        id: data.id,
        content: data.content,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        userId: data.user.id,
        postId: data.post_id,
        user: {
          id: data.user.id,
          name: data.user.full_name || data.user.username || 'User',
          avatar: data.user.avatar_url,
          role: (data.user.role as 'user' | 'expert') || 'user'
        }
      };
    } catch (error) {
      console.error(`Error adding comment to post ${postId}:`, error);
      toast({
        title: "Failed to add comment",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      return null;
    }
  }
};
