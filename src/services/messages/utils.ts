
import { toast } from '@/components/ui/use-toast';
import { User } from '@/services/api';

export function formatUserFromProfile(profile: any): User {
  return {
    id: profile.id,
    name: profile.full_name || profile.username || 'User',
    email: '',
    avatar: profile.avatar_url,
    role: (profile.role as 'user' | 'expert') || 'user',
    followers: profile.followers || 0,
    following: profile.following || 0,
    joined: ''
  };
}

export function handleError(error: unknown, title: string): void {
  console.error(`Error: ${title}:`, error);
  toast({
    title,
    description: error instanceof Error ? error.message : "An unexpected error occurred",
    variant: "destructive"
  });
}
