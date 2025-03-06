
import { supabase } from '@/integrations/supabase/client';
import { handleError } from './utils';

export async function likePost(postId: string): Promise<boolean> {
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
    handleError(error, "Failed to like post");
    return false;
  }
}

export async function unlikePost(postId: string): Promise<boolean> {
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
    handleError(error, "Failed to unlike post");
    return false;
  }
}
