
import { Database } from '@/integrations/supabase/types';

// Post Types
export type Post = Database['public']['Tables']['posts']['Row'];
export type PostInsert = Database['public']['Tables']['posts']['Insert'];
export type PostUpdate = Database['public']['Tables']['posts']['Update'];

// Comment Types
export type Comment = Database['public']['Tables']['comments']['Row'] & {
  author?: Profile;
  replies?: Comment[];
};
export type CommentInsert = Database['public']['Tables']['comments']['Insert'];
export type CommentUpdate = Database['public']['Tables']['comments']['Update'];

// Like Types
export type Like = Database['public']['Tables']['likes']['Row'];
export type LikeInsert = Database['public']['Tables']['likes']['Insert'];

// Bookmark Types
export type Bookmark = Database['public']['Tables']['bookmarks']['Row'];
export type BookmarkInsert = Database['public']['Tables']['bookmarks']['Insert'];

// Profile Types
export type Profile = Database['public']['Tables']['profiles']['Row'];

// Circle Types
export type Circle = Database['public']['Tables']['circles']['Row'] & {
  memberCount?: number;
  creator?: Profile;
};
export type CircleInsert = Database['public']['Tables']['circles']['Insert'];
export type CircleUpdate = Database['public']['Tables']['circles']['Update'];

export type CircleMember = Database['public']['Tables']['circle_members']['Row'] & {
  profile?: Profile;
};
export type CircleMemberInsert = Database['public']['Tables']['circle_members']['Insert'];
export type CircleMemberUpdate = Database['public']['Tables']['circle_members']['Update'];

export type CirclePost = Database['public']['Tables']['circle_posts']['Row'];
export type CirclePostInsert = Database['public']['Tables']['circle_posts']['Insert'];
export type CirclePostUpdate = Database['public']['Tables']['circle_posts']['Update'];

// News Article Types
export type NewsArticle = Database['public']['Tables']['news_articles']['Row'];

// Analytics Types
export type AnalyticsMetric = Database['public']['Tables']['analytics_metrics']['Row'];

// Role type
export type UserRole = 'admin' | 'co-admin' | 'member' | 'user' | 'expert';

// Share Types
export type PostShare = Database['public']['Tables']['post_shares']['Row'];
export type PostShareInsert = Database['public']['Tables']['post_shares']['Insert'];
export type ShareType = 'user' | 'circle' | 'public';
