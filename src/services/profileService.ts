
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { User, Profile } from '@/services/api';

export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        toast({
          title: "Failed to load profile",
          description: error.message,
          variant: "destructive"
        });
        return null;
      }
      
      return {
        id: data.id,
        name: data.full_name || data.username || 'User',
        bio: data.bio || '',
        avatar: data.avatar_url,
        role: data.role as 'user' | 'expert',
        followers: data.followers || 0,
        following: data.following || 0,
        joined: new Date(data.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      };
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  },
  
  async updateProfile(userId: string, profileData: { name: string, bio: string, avatar?: string }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          full_name: profileData.name,
          bio: profileData.bio,
          avatar_url: profileData.avatar,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
        
      if (error) {
        toast({
          title: "Failed to update profile",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      });
      
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Failed to update profile",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  },
  
  async unfollowUser(userId: string): Promise<boolean> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error("You must be logged in to unfollow users");
      }
      
      // Delete the follow record
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', userData.user.id)
        .eq('following_id', userId);
        
      if (error) {
        throw error;
      }
      
      // Update follower and following counts
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
        throw new Error("You must be logged in to follow users");
      }
      
      // Create the follow record
      const { error } = await supabase
        .from('follows')
        .insert({
          follower_id: userData.user.id,
          following_id: userId
        });
        
      if (error) {
        throw error;
      }
      
      // Update follower and following counts
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
      const { data, error } = await supabase
        .from('follows')
        .select(`
          follower_id,
          followers:profiles!follower_id(*)
        `)
        .eq('following_id', userId);
        
      if (error) {
        throw error;
      }
      
      return data.map(item => ({
        id: item.followers.id,
        name: item.followers.full_name || item.followers.username || 'User',
        email: '',
        avatar: item.followers.avatar_url,
        role: (item.followers.role as 'user' | 'expert') || 'user',
        followers: item.followers.followers || 0,
        following: item.followers.following || 0,
        joined: ''
      }));
    } catch (error) {
      console.error(`Error fetching followers for user ${userId}:`, error);
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
      const { data, error } = await supabase
        .from('follows')
        .select(`
          following_id,
          following:profiles!following_id(*)
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
      console.error(`Error fetching following for user ${userId}:`, error);
      toast({
        title: "Failed to load following",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      return [];
    }
  }
};
