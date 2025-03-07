
import { Database } from '../integrations/supabase/types';

export type Profile = Database['public']['Tables']['profiles']['Row'] & {
  is_verified?: boolean;
};

export type Post = Database['public']['Tables']['posts']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Comment = Database['public']['Tables']['comments']['Row'] & {
  edited?: boolean;
  parent_id?: string;
  author?: Profile;
  replies?: Comment[];
  updated_at: string; // Required to match DB type
};

export type Bookmark = {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
  post?: Post;
};

export type Circle = {
  id: string;
  name: string;
  type: 'public' | 'private';
  description?: string;
  created_at: string;
  created_by: string;
  member_count?: number;
  post_count?: number;
};

export type CircleMember = {
  id: string;
  circle_id: string;
  user_id: string;
  role: 'admin' | 'co-admin' | 'member';
  created_at: string;
  profile?: Profile;
};

export type CirclePost = {
  id: string;
  circle_id: string;
  post_id: string;
  created_at: string;
  is_pinned: boolean;
  post?: Post;
};

export type NewsArticle = {
  id: string;
  title: string;
  summary?: string;
  url: string;
  source: string;
  category: string;
  published_at?: string;
  thumbnail_url?: string;
  relevance_score?: number;
  created_at: string;
};

export type AnalyticsMetric = {
  id: string;
  metric_type: string;
  metric_name: string;
  metric_value: number;
  entity_id?: string;
  entity_type?: string;
  date_recorded: string;
  created_at: string;
};

export type PostShare = {
  id: string;
  user_id: string;
  post_id: string;
  share_type: 'user' | 'circle' | 'public';
  target_id?: string;
  commentary?: string;
  created_at: string;
};

export enum CircleRole {
  ADMIN = 'admin',
  CO_ADMIN = 'co-admin',
  MEMBER = 'member'
}

export interface EnhancedPost extends Post {
  author?: Profile;
  category?: Category;
  isBookmarked?: boolean;
  isLiked?: boolean;
  like_count?: number;
  comment_count?: number;
  share_count?: number;
  is_pinned?: boolean;
}

export type ShareType = 'user' | 'circle' | 'public';

export type CircleInsert = Omit<Circle, 'id' | 'created_at' | 'member_count' | 'post_count'>;
export type CircleUpdate = Partial<Omit<Circle, 'id' | 'created_at' | 'created_by'>>;

export type PostShareInsert = Omit<PostShare, 'id' | 'created_at'>;

export type Like = {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
};

export type LikeInsert = Omit<Like, 'id' | 'created_at'>;
export type BookmarkInsert = Omit<Bookmark, 'id' | 'created_at'>;
export type CommentInsert = Partial<Omit<Comment, 'id' | 'created_at' | 'updated_at' | 'edited' | 'author' | 'replies'>>;
export type CommentUpdate = Partial<Omit<Comment, 'id' | 'created_at' | 'post_id' | 'user_id' | 'author' | 'replies'>>;

export type UserRole = 'user' | 'expert' | 'admin';
