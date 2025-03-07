import { Database } from './supabase';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Post = Database['public']['Tables']['posts']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Comment = Database['public']['Tables']['comments']['Row'] & {
  edited?: boolean;
  parent_id?: string;
  author?: Profile;
  replies?: Comment[];
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
}
