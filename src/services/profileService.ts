
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { User } from '@/services/api';

export const profileService = {
  async getUserProfile(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        throw error;
      }
      
      return {
        id: data.id,
        name: data.full_name || data.username || 'User',
        email: '',
        avatar: data.avatar_url,
        role: (data.role as 'user' | 'expert') || 'user',
        followers: data.followers || 0,
        following: data.following || 0,
        joined: data.created_at
      };
    } catch (error) {
      console.error(`Error fetching user profile for ${userId}:`, error);
      toast({
        title: "Failed to load profile",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      return null;
    }
  },
  
  async updateProfile(bio: string, fullName: string, avatarUrl: string): Promise<User | null> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error("You must be logged in to update your profile");
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .update({
          updated_at: new Date().toISOString(),
          bio,
          avatar_url: avatarUrl,
          full_name: fullName
        })
        .eq('id', userData.user.id)
        .select('*')
        .single();
        
      if (error) {
        throw error;
      }
      
      return {
        id: data.id,
        name: data.full_name || data.username || 'User',
        email: '',
        avatar: data.avatar_url,
        role: (data.role as 'user' | 'expert') || 'user',
        followers: data.followers || 0,
        following: data.following || 0,
        joined: data.created_at
      };
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Failed to update profile",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      return null;
    }
  },
  
  async unfollowUser(userId: string): Promise<boolean> {
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
      console.error(`Error unfollowing user ${userId}:`, error);
      toast({
        title: "Failed to unfollow user",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  },
  
  async followUser(userId: string): Promise<boolean> {
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
      console.error(`Error following user ${userId}:`, error);
      toast({
        title: "Failed to follow user",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  },
  
  async getFollowers(userId: string): Promise<User[]> {
    try {
      // Get all followers of the user
      const { data, error } = await supabase
        .from('follows')
        .select(`
          follower:follower_id(id, full_name, username, avatar_url, role, followers, following)
        `)
        .eq('following_id', userId);
        
      if (error) {
        throw error;
      }
      
      return data.map(item => ({
        id: item.follower.id,
        name: item.follower.full_name || item.follower.username || 'User',
        email: '',
        avatar: item.follower.avatar_url,
        role: (item.follower.role as 'user' | 'expert') || 'user',
        followers: item.follower.followers || 0,
        following: item.follower.following || 0,
        joined: ''
      }));
    } catch (error) {
      console.error(`Error getting followers for user ${userId}:`, error);
      toast({
        title: "Failed to load followers",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      return [];
    }
  },
  
  async getFollowing(userId: string): Promise<User[]> {
    try {
      // Get all users followed by the user
      const { data, error } = await supabase
        .from('follows')
        .select(`
          following:following_id(id, full_name, username, avatar_url, role, followers, following)
        `)
        .eq('follower_id', userId);
        
      if (error) {
        throw error;
      }
      
      return data.map(item => ({
        id: item.following.id,
        name: item.following.full_name || item.following.username || 'User',
        email: '',
        avatar: item.following.avatar_url,
        role: (item.following.role as 'user' | 'expert') || 'user',
        followers: item.following.followers || 0,
        following: item.following.following || 0,
        joined: ''
      }));
    } catch (error) {
      console.error(`Error getting following for user ${userId}:`, error);
      toast({
        title: "Failed to load following",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      return [];
    }
  }
};
