
import { toast } from "@/hooks/use-toast";
import { User } from "../api";
import { supabase } from "@/integrations/supabase/client";

export const formatUser = (
  userData: any, 
  profileData?: any
): User => {
  return {
    id: userData.id,
    name: profileData?.full_name || userData.email?.split('@')[0] || 'User',
    email: userData.email || '',
    avatar: profileData?.avatar_url,
    role: (profileData?.role as 'user' | 'expert') || 'user',
    followers: profileData?.followers || 0,
    following: profileData?.following || 0,
    joined: new Date(userData.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  };
};

export const fetchUserProfile = async (userId: string) => {
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (profileError) {
    console.error("Error fetching profile:", profileError);
  }
  
  return profileData;
};

export const showToast = (
  title: string, 
  description: string, 
  variant: "default" | "destructive" = "default"
) => {
  toast({
    title,
    description,
    variant
  });
};
