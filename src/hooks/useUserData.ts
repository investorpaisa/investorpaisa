
import { useAuth } from '@/contexts/AuthContext';
import { ExtendedUser } from '@/types/app';

export const useUserData = (): ExtendedUser | null => {
  const { user, profile } = useAuth();
  
  if (!user || !profile) return null;
  
  return {
    id: user.id,
    email: user.email || '',
    name: profile.full_name,
    username: profile.username,
    avatar: profile.avatar_url,
    bio: profile.bio,
    role: profile.role
  };
};
