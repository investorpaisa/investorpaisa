
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/services/api';
import { ProfileUpdateData } from './types';
import { formatUserProfile, handleError } from './utils';

export async function getUserProfile(userId: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      throw error;
    }
    
    return formatUserProfile(data);
  } catch (error) {
    handleError(error, `Failed to load profile for ${userId}`);
    return null;
  }
}

export async function updateProfile(profileData: ProfileUpdateData): Promise<User | null> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      throw new Error("You must be logged in to update your profile");
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .update({
        updated_at: new Date().toISOString(),
        bio: profileData.bio,
        avatar_url: profileData.avatarUrl,
        full_name: profileData.fullName
      })
      .eq('id', userData.user.id)
      .select('*')
      .single();
      
    if (error) {
      throw error;
    }
    
    return formatUserProfile(data);
  } catch (error) {
    handleError(error, "Failed to update profile");
    return null;
  }
}
