
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Post, Comment, Category } from '@/services/api';

export const postService = {
  async getPosts(): Promise<Post[]> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id, title, content, likes, comment_count, created_at, 
          user:user_id(id, full_name, username, avatar_url, role, followers, following),
          category:category_id(id, name, description, icon, post_count)
        `)
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
        author: {
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
  
  async getCategoryPosts(categoryId: string): Promise<Post[]> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id, title, content, likes, comment_count, created_at, 
          user:user_id(id, full_name, username, avatar_url, role, followers, following),
          category:category_id(id, name, description, icon, post_count)
        `)
        .eq('category_id', categoryId)
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
        author: {
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
      console.error(`Error fetching posts for category ${categoryId}:`, error);
      toast({
        title: "Failed to load category posts",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      return [];
    }
  },
  
  async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }

      return data.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description || '',
        icon: category.icon || '',
        posts: category.post_count || 0
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Failed to load categories",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      return [];
    }
  },
  
  async getComments(postId: string): Promise<Comment[]> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          id, content, created_at, updated_at, user_id, post_id,
          user:user_id(id, full_name, username, avatar_url, role)
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
        author: {
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
  
  async createPost(title: string, content: string, categoryId: string): Promise<Post | null> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error("You must be logged in to create posts");
      }
      
      const { data, error } = await supabase
        .from('posts')
        .insert({
          title,
          content,
          user_id: userData.user.id,
          category_id: categoryId,
          likes: 0,
          comment_count: 0
        })
        .select(`
          id, title, content, likes, comment_count, created_at, 
          user:user_id(id, full_name, username, avatar_url, role, followers, following),
          category:category_id(id, name, description, icon, post_count)
        `)
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
        author: {
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
      console.error("Error creating post:", error);
      toast({
        title: "Failed to create post",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      return null;
    }
  },
  
  async addComment(postId: string, content: string): Promise<Comment | null> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error("You must be logged in to comment");
      }
      
      const { data, error } = await supabase
        .from('comments')
        .insert({
          content,
          user_id: userData.user.id,
          post_id: postId
        })
        .select(`
          id, content, created_at, user_id, post_id,
          user:user_id(id, full_name, username, avatar_url, role)
        `)
        .single();
        
      if (error) {
        throw error;
      }
      
      // Increment comment count
      await supabase.rpc('increment_comments', { post_id: postId });
      
      return {
        id: data.id,
        content: data.content,
        createdAt: data.created_at,
        author: {
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
  },
  
  async unlikePost(postId: string): Promise<boolean> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error("You must be logged in to unlike a post");
      }
      
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', userData.user.id)
        .eq('post_id', postId);
        
      if (error) {
        throw error;
      }
      
      // Decrement likes count
      await supabase.rpc('decrement_likes', { post_id: postId });
      
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
      
      const { error } = await supabase
        .from('likes')
        .insert({
          user_id: userData.user.id,
          post_id: postId
        });
        
      if (error) {
        throw error;
      }
      
      // Increment likes count
      await supabase.rpc('increment_likes', { post_id: postId });
      
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
  }
};
