
import { User } from '@/services/api';

export interface ProfileUpdateData {
  bio: string;
  fullName: string;
  avatarUrl: string;
}

export interface ProfileResponse {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  role: string;
  followers: number | null;
  following: number | null;
  created_at: string | null;
  bio: string | null;
}
