
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/services/api';
import { formatUserProfile, handleError } from './utils';

export async function followUser(userId: string): Promise<boolean> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      throw new Error("You must be logged in to follow a user");
    }
    
    const { error } = await supabase
      .from('follows')
      .insert({
        follower_id: userData.user.id,
        following_id: userId
      });
      
    if (error) {
      throw error;
    }
    
    // Increment followers/following counts
    await supabase.rpc('increment_followers', { user_id: userId });
    await supabase.rpc('increment_following', { user_id: userData.user.id });
    
    return true;
  } catch (error) {
    handleError(error, `Failed to follow user ${userId}`);
    return false;
  }
}

export async function unfollowUser(userId: string): Promise<boolean> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      throw new Error("You must be logged in to unfollow a user");
    }
    
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', userData.user.id)
      .eq('following_id', userId);
      
    if (error) {
      throw error;
    }
    
    // Decrement followers/following counts
    await supabase.rpc('decrement_followers', { user_id: userId });
    await supabase.rpc('decrement_following', { user_id: userData.user.id });
    
    return true;
  } catch (error) {
    handleError(error, `Failed to unfollow user ${userId}`);
    return false;
  }
}

export async function getFollowers(userId: string): Promise<User[]> {
  try {
    // Fix the query to properly specify the relationship
    const { data, error } = await supabase
      .from('follows')
      .select(`
        profiles!follows_follower_id_fkey(id, full_name, username, avatar_url, role, followers, following)
      `)
      .eq('following_id', userId);
      
    if (error) {
      throw error;
    }
    
    // Transform the data into the User format
    return data.map(item => {
      const profile = item.profiles;
      return formatUserProfile(profile);
    });
  } catch (error) {
    handleError(error, `Failed to load followers for user ${userId}`);
    return [];
  }
}

export async function getFollowing(userId: string): Promise<User[]> {
  try {
    // Fix the query to properly specify the relationship
    const { data, error } = await supabase
      .from('follows')
      .select(`
        profiles!follows_following_id_fkey(id, full_name, username, avatar_url, role, followers, following)
      `)
      .eq('follower_id', userId);
      
    if (error) {
      throw error;
    }
    
    // Transform the data into the User format
    return data.map(item => {
      const profile = item.profiles;
      return formatUserProfile(profile);
    });
  } catch (error) {
    handleError(error, `Failed to load following for user ${userId}`);
    return [];
  }
}
