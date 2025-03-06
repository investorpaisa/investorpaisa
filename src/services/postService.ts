
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Post, Comment, User } from "./api";

class PostService {
  async getFeedPosts(): Promise<Post[]> {
    try {
      // Get posts with author info
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            id, full_name, username, avatar_url, role, followers, following
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const currentUser = await supabase.auth.getUser();

      // Check if posts are liked by current user
      const posts: Post[] = await Promise.all(data.map(async (post) => {
        let isLiked = false;
        
        if (currentUser.data.user) {
          const { data: likeData } = await supabase
            .from('likes')
            .select('*')
            .eq('post_id', post.id)
            .eq('user_id', currentUser.data.user.id)
            .single();
          
          isLiked = !!likeData;
        }
        
        const profile = post.profiles;
        const author: User = {
          id: profile.id,
          name: profile.full_name || profile.username || 'Anonymous',
          email: '', // Email is not exposed in public profile
          avatar: profile.avatar_url,
          role: (profile.role as 'user' | 'expert') || 'user',
          followers: profile.followers || 0,
          following: profile.following || 0,
          joined: ''  // We'll skip this for feed posts
        };
        
        return {
          id: post.id,
          title: post.title,
          content: post.content,
          author,
          category: post.category_id || '',
          likes: post.likes || 0,
          comments: post.comment_count || 0,
          createdAt: new Date(post.created_at).toISOString(),
          isLiked
        };
      }));

      return posts;
    } catch (error) {
      console.error("Error fetching feed posts:", error);
      toast({
        title: "Failed to fetch posts",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      return [];
    }
  }
  
  async getPostsByCategory(categoryId: string): Promise<Post[]> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            id, full_name, username, avatar_url, role, followers, following
          )
        `)
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      
      const posts: Post[] = data.map(post => {
        const profile = post.profiles;
        const author: User = {
          id: profile.id,
          name: profile.full_name || profile.username || 'Anonymous',
          email: '', // Email is not exposed in public profile
          avatar: profile.avatar_url,
          role: (profile.role as 'user' | 'expert') || 'user',
          followers: profile.followers || 0,
          following: profile.following || 0,
          joined: ''  // We'll skip this for category posts
        };
        
        return {
          id: post.id,
          title: post.title,
          content: post.content,
          author,
          category: post.category_id || '',
          likes: post.likes || 0,
          comments: post.comment_count || 0,
          createdAt: new Date(post.created_at).toISOString(),
        };
      });

      return posts;
    } catch (error) {
      console.error(`Error fetching posts for category ${categoryId}:`, error);
      toast({
        title: "Failed to fetch category posts",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      return [];
    }
  }

  async getPostById(postId: string): Promise<Post | null> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            id, full_name, username, avatar_url, role, followers, following
          )
        `)
        .eq('id', postId)
        .single();

      if (error) {
        throw error;
      }
      
      const profile = data.profiles;
      const author: User = {
        id: profile.id,
        name: profile.full_name || profile.username || 'Anonymous',
        email: '', // Email is not exposed in public profile
        avatar: profile.avatar_url,
        role: (profile.role as 'user' | 'expert') || 'user',
        followers: profile.followers || 0,
        following: profile.following || 0,
        joined: ''  // We'll skip this for single post
      };
      
      return {
        id: data.id,
        title: data.title,
        content: data.content,
        author,
        category: data.category_id || '',
        likes: data.likes || 0,
        comments: data.comment_count || 0,
        createdAt: new Date(data.created_at).toISOString(),
      };
    } catch (error) {
      console.error(`Error fetching post ${postId}:`, error);
      return null;
    }
  }

  async createPost(title: string, content: string, categoryId: string): Promise<Post | null> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error("You must be logged in to create a post");
      }
      
      const { data, error } = await supabase
        .from('posts')
        .insert({
          title,
          content,
          user_id: userData.user.id,
          category_id: categoryId,
        })
        .select(`
          *,
          profiles:user_id (
            id, full_name, username, avatar_url, role, followers, following
          )
        `)
        .single();

      if (error) {
        throw error;
      }
      
      toast({
        title: "Post created",
        description: "Your post has been published successfully"
      });
      
      const profile = data.profiles;
      const author: User = {
        id: profile.id,
        name: profile.full_name || profile.username || 'Anonymous',
        email: '', // Email is not exposed in public profile
        avatar: profile.avatar_url,
        role: (profile.role as 'user' | 'expert') || 'user',
        followers: profile.followers || 0,
        following: profile.following || 0,
        joined: ''
      };
      
      return {
        id: data.id,
        title: data.title,
        content: data.content,
        author,
        category: data.category_id || '',
        likes: data.likes || 0,
        comments: data.comment_count || 0,
        createdAt: new Date(data.created_at).toISOString(),
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
  }

  async likePost(postId: string): Promise<boolean> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error("You must be logged in to like a post");
      }
      
      // Check if already liked
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
        // Already liked, so unlike
        const { error: unlikeError } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userData.user.id);
          
        if (unlikeError) {
          throw unlikeError;
        }
        
        // Decrement likes count
        const { error: updateError } = await supabase.rpc('decrement_likes', { post_id: postId });
        
        if (updateError) {
          console.error("Error decrementing likes:", updateError);
        }
        
        return false; // Indicating the post is now unliked
      } else {
        // Not liked yet, so like
        const { error: likeError } = await supabase
          .from('likes')
          .insert({
            post_id: postId,
            user_id: userData.user.id
          });
          
        if (likeError) {
          throw likeError;
        }
        
        // Increment likes count
        const { error: updateError } = await supabase.rpc('increment_likes', { post_id: postId });
        
        if (updateError) {
          console.error("Error incrementing likes:", updateError);
        }
        
        return true; // Indicating the post is now liked
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Failed to like post",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  }

  async getComments(postId: string): Promise<Comment[]> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:user_id (
            id, full_name, username, avatar_url, role, followers, following
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }
      
      return data.map(comment => {
        const profile = comment.profiles;
        const author: User = {
          id: profile.id,
          name: profile.full_name || profile.username || 'Anonymous',
          email: '', // Email is not exposed in public profile
          avatar: profile.avatar_url,
          role: (profile.role as 'user' | 'expert') || 'user',
          followers: profile.followers || 0,
          following: profile.following || 0,
          joined: ''
        };
        
        return {
          id: comment.id,
          content: comment.content,
          author,
          createdAt: new Date(comment.created_at).toISOString(),
        };
      });
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      toast({
        title: "Failed to fetch comments",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      return [];
    }
  }

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
          post_id: postId,
          user_id: userData.user.id
        })
        .select(`
          *,
          profiles:user_id (
            id, full_name, username, avatar_url, role, followers, following
          )
        `)
        .single();

      if (error) {
        throw error;
      }
      
      // Increment comment count
      const { error: updateError } = await supabase.rpc('increment_comments', { post_id: postId });
      
      if (updateError) {
        console.error("Error incrementing comment count:", updateError);
      }
      
      const profile = data.profiles;
      const author: User = {
        id: profile.id,
        name: profile.full_name || profile.username || 'Anonymous',
        email: '', // Email is not exposed in public profile
        avatar: profile.avatar_url,
        role: (profile.role as 'user' | 'expert') || 'user',
        followers: profile.followers || 0,
        following: profile.following || 0,
        joined: ''
      };
      
      return {
        id: data.id,
        content: data.content,
        author,
        createdAt: new Date(data.created_at).toISOString(),
      };
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Failed to add comment",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      return null;
    }
  }
}

export const postService = new PostService();
