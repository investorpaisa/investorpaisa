
import { supabase } from "@/integrations/supabase/client";
import { toast } from '@/hooks/use-toast';

export const fetchUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

export const formatUser = (authUser: any, profileData: any = null) => {
  const role = profileData?.role || 'user';
  
  return {
    id: authUser.id,
    name: profileData?.full_name || authUser.user_metadata?.full_name || authUser.user_metadata?.name || 'Anonymous User',
    email: authUser.email,
    role: role as 'user' | 'expert',
    avatar: profileData?.avatar_url || authUser.user_metadata?.avatar_url,
    followers: profileData?.followers || 0,
    following: profileData?.following || 0,
    joined: new Date(authUser.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    username: profileData?.username || authUser.user_metadata?.username || authUser.email?.split('@')[0]
  };
};

export const showToast = (title: string, message: string, type: 'default' | 'destructive' = 'default') => {
  toast({
    title,
    description: message,
    variant: type
  });
};
