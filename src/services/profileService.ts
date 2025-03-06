
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { User } from "./api";

class ProfileService {
  async getProfileById(profileId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single();

      if (error) {
        throw error;
      }

      // Get user creation date
      const { data: userData, error: userError } = await supabase
        .from('auth.users')
        .select('created_at')
        .eq('id', profileId)
        .single();

      let createdAt = new Date();
      if (!userError && userData) {
        createdAt = new Date(userData.created_at);
      }

      return {
        id: data.id,
        name: data.full_name || data.username || 'User',
        email: '', // Not exposing email in public profile
        avatar: data.avatar_url,
        role: (data.role as 'user' | 'expert') || 'user',
        followers: data.followers || 0,
        following: data.following || 0,
        joined: createdAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      };
    } catch (error) {
      console.error(`Error fetching profile ${profileId}:`, error);
      return null;
    }
  }

  async updateProfile(
    profileData: {
      name?: string;
      avatar?: string;
      bio?: string;
    }
  ): Promise<User | null> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error("You must be logged in to update your profile");
      }
      
      const updates = {
        ...(profileData.name && { full_name: profileData.name }),
        ...(profileData.avatar && { avatar_url: profileData.avatar }),
        ...(profileData.bio && { bio: profileData.bio }),
        updated_at: new Date()
      };
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userData.user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully"
      });
      
      return {
        id: data.id,
        name: data.full_name || data.username || 'User',
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
  }

  async followUser(userId: string): Promise<boolean> {
    try {
      const { data: currentUser, error: userError } = await supabase.auth.getUser();
      
      if (userError || !currentUser.user) {
        throw new Error("You must be logged in to follow users");
      }
      
      if (currentUser.user.id === userId) {
        throw new Error("You cannot follow yourself");
      }

      // Check if already following
      const { data: existingFollow, error: checkError } = await supabase
        .from('follows')
        .select('*')
        .eq('follower_id', currentUser.user.id)
        .eq('following_id', userId)
        .maybeSingle();
        
      if (checkError) {
        throw checkError;
      }
      
      if (existingFollow) {
        // Already following, so unfollow
        const { error: unfollowError } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', currentUser.user.id)
          .eq('following_id', userId);
          
        if (unfollowError) {
          throw unfollowError;
        }
        
        // Update follower/following counts
        await supabase.rpc('decrement_followers', { user_id: userId });
        await supabase.rpc('decrement_following', { user_id: currentUser.user.id });
        
        toast({
          title: "Unfollowed",
          description: "You are no longer following this user"
        });
        
        return false; // Indicating not following anymore
      } else {
        // Not following yet, so follow
        const { error: followError } = await supabase
          .from('follows')
          .insert({
            follower_id: currentUser.user.id,
            following_id: userId
          });
          
        if (followError) {
          throw followError;
        }
        
        // Update follower/following counts
        await supabase.rpc('increment_followers', { user_id: userId });
        await supabase.rpc('increment_following', { user_id: currentUser.user.id });
        
        toast({
          title: "Following",
          description: "You are now following this user"
        });
        
        return true; // Indicating now following
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      toast({
        title: "Failed to update follow status",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  }

  async isFollowing(userId: string): Promise<boolean> {
    try {
      const { data: currentUser, error: userError } = await supabase.auth.getUser();
      
      if (userError || !currentUser.user) {
        return false;
      }
      
      const { data, error } = await supabase
        .from('follows')
        .select('*')
        .eq('follower_id', currentUser.user.id)
        .eq('following_id', userId)
        .maybeSingle();
        
      if (error) {
        throw error;
      }
      
      return !!data;
    } catch (error) {
      console.error("Error checking follow status:", error);
      return false;
    }
  }

  async getFollowers(userId: string): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('follows')
        .select(`
          follower:follower_id (
            id, full_name, username, avatar_url, role, followers, following
          )
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
          joined: '' // Not needed for this list
        };
      });
    } catch (error) {
      console.error(`Error fetching followers for ${userId}:`, error);
      return [];
    }
  }

  async getFollowing(userId: string): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('follows')
        .select(`
          following:following_id (
            id, full_name, username, avatar_url, role, followers, following
          )
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
          joined: '' // Not needed for this list
        };
      });
    } catch (error) {
      console.error(`Error fetching following for ${userId}:`, error);
      return [];
    }
  }
}

export const profileService = new ProfileService();
