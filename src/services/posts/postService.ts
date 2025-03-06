
import { supabase } from '@/integrations/supabase/client';
import { Post, Comment } from './types';
import { handleError, formatPostFromSupabase, formatCommentFromSupabase } from './utils';

export async function getPosts(): Promise<Post[]> {
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

    return data.map(formatPostFromSupabase);
  } catch (error) {
    handleError(error, "Failed to load posts");
    return [];
  }
}

export async function getCategoryPosts(categoryId: string): Promise<Post[]> {
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

    return data.map(formatPostFromSupabase);
  } catch (error) {
    handleError(error, "Failed to load category posts");
    return [];
  }
}

export async function getComments(postId: string): Promise<Comment[]> {
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

    return data.map(formatCommentFromSupabase);
  } catch (error) {
    handleError(error, "Failed to load comments");
    return [];
  }
}

export async function createPost(title: string, content: string, categoryId: string): Promise<Post | null> {
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
    
    return formatPostFromSupabase(data);
  } catch (error) {
    handleError(error, "Failed to create post");
    return null;
  }
}

export async function addComment(postId: string, content: string): Promise<Comment | null> {
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
    
    return formatCommentFromSupabase(data);
  } catch (error) {
    handleError(error, "Failed to add comment");
    return null;
  }
}
