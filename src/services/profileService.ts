
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { User } from '@/services/api';

export const profileService = {
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authData.user) {
        return null;
      }
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();
        
      if (profileError) {
        console.error("Error fetching profile:", profileError);
        return null;
      }
      
      return {
        id: profileData.id,
        name: profileData.full_name || profileData.username || authData.user.email?.split('@')[0] || 'User',
        email: authData.user.email || '',
        avatar: profileData.avatar_url,
        role: (profileData.role as 'user' | 'expert') || 'user',
        followers: profileData.followers || 0,
        following: profileData.following || 0,
        joined: new Date(authData.user.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      };
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  },

  async updateProfile(bio: string, fullName: string, avatarUrl: string): Promise<User | null> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error("You must be logged in to update your profile");
      }
      
      // Update the profile
      const { data, error } = await supabase
        .from('profiles')
        .update({
          updated_at: new Date().toISOString(), // Convert Date to string
          bio,
          avatar_url: avatarUrl,
          full_name: fullName
        })
        .eq('id', userData.user.id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated"
      });
      
      return {
        id: data.id,
        name: data.full_name || data.username || userData.user.email?.split('@')[0] || 'User',
        email: userData.user.email || '',
        avatar: data.avatar_url,
        role: (data.role as 'user' | 'expert') || 'user',
        followers: data.followers || 0,
        following: data.following || 0,
        joined: new Date(userData.user.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
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
      
      if (userData.user.id === userId) {
        throw new Error("You cannot unfollow yourself");
      }
      
      // Check if already following
      const { data: existingFollow, error: checkError } = await supabase
        .from('follows')
        .select('*')
        .eq('follower_id', userData.user.id)
        .eq('following_id', userId)
        .maybeSingle();
        
      if (checkError) {
        throw checkError;
      }
      
      if (!existingFollow) {
        // Not following this user
        return false;
      }
      
      // Remove the follow
      const { error: deleteError } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', userData.user.id)
        .eq('following_id', userId);
        
      if (deleteError) {
        throw deleteError;
      }
      
      // Update follower/following counts
      await supabase.rpc('decrement_followers', { user_id: userId });
      await supabase.rpc('decrement_following', { user_id: userData.user.id });
      
      toast({
        title: "Unfollowed",
        description: "You have unfollowed this user"
      });
      
      return true;
    } catch (error) {
      console.error(`Error unfollowing user ${userId}:`, error);
      toast({
        title: "Failed to unfollow",
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
      
      if (userData.user.id === userId) {
        throw new Error("You cannot follow yourself");
      }
      
      // Check if already following
      const { data: existingFollow, error: checkError } = await supabase
        .from('follows')
        .select('*')
        .eq('follower_id', userData.user.id)
        .eq('following_id', userId)
        .maybeSingle();
        
      if (checkError) {
        throw checkError;
      }
      
      if (existingFollow) {
        // Already following this user
        return false;
      }
      
      // Add the follow
      const { error: insertError } = await supabase
        .from('follows')
        .insert({
          follower_id: userData.user.id,
          following_id: userId
        });
        
      if (insertError) {
        throw insertError;
      }
      
      // Update follower/following counts
      await supabase.rpc('increment_followers', { user_id: userId });
      await supabase.rpc('increment_following', { user_id: userData.user.id });
      
      toast({
        title: "Followed",
        description: "You are now following this user"
      });
      
      return true;
    } catch (error) {
      console.error(`Error following user ${userId}:`, error);
      toast({
        title: "Failed to follow",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  },

  async getFollowers(userId: string): Promise<User[]> {
    try {
      // Get followers with proper column hints
      const { data, error } = await supabase
        .from('follows')
        .select(`
          follower:follower_id(id, full_name, username, avatar_url, role, followers, following)
        `)
        .eq('following_id', userId);
        
      if (error) {
        throw error;
      }
      
      return data.map(item => {
        const follower = item.follower;
        return {
          id: follower.id,
          name: follower.full_name || follower.username || 'User',
          email: '', // Not exposing email
          avatar: follower.avatar_url,
          role: (follower.role as 'user' | 'expert') || 'user',
          followers: follower.followers || 0,
          following: follower.following || 0,
          joined: ''
        };
      });
    } catch (error) {
      console.error(`Error fetching followers for user ${userId}:`, error);
      toast({
        title: "Failed to fetch followers",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      return [];
    }
  },

  async getFollowing(userId: string): Promise<User[]> {
    try {
      // Get following with proper column hints
      const { data, error } = await supabase
        .from('follows')
        .select(`
          following:following_id(id, full_name, username, avatar_url, role, followers, following)
        `)
        .eq('follower_id', userId);
        
      if (error) {
        throw error;
      }
      
      return data.map(item => {
        const following = item.following;
        return {
          id: following.id,
          name: following.full_name || following.username || 'User',
          email: '', // Not exposing email
          avatar: following.avatar_url,
          role: (following.role as 'user' | 'expert') || 'user',
          followers: following.followers || 0,
          following: following.following || 0,
          joined: ''
        };
      });
    } catch (error) {
      console.error(`Error fetching following for user ${userId}:`, error);
      toast({
        title: "Failed to fetch following",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      return [];
    }
  }
};
