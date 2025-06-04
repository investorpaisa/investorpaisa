
// Core application types for InvestorPaisa v1.0

export type UserRole = 'user' | 'influencer' | 'expert';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type RiskProfile = 'conservative' | 'moderate' | 'aggressive' | 'very_aggressive';
export type PostType = 'text' | 'image' | 'video' | 'poll' | 'market_analysis' | 'financial_tip';
export type PostVisibility = 'public' | 'circle' | 'private';
export type CircleRole = 'admin' | 'moderator' | 'member';
export type AssetType = 'stock' | 'crypto' | 'mutual_fund' | 'bond' | 'commodity';
export type ServiceType = 'consultation' | 'portfolio_review' | 'financial_planning' | 'investment_advice' | 'tax_planning';
export type NotificationType = 'market_alert' | 'circle_mention' | 'post_interaction' | 'expert_booking' | 'system';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
  verification_status: VerificationStatus;
  financial_goals?: Record<string, any>;
  risk_profile?: RiskProfile;
  onboarding_completed: boolean;
  financial_literacy_score?: number;
  bio?: string;
  credentials?: Record<string, any>;
  followers: number;
  following: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

// Extended User interface that includes profile data for convenience
export interface ExtendedUser {
  id: string;
  email: string;
  name?: string;
  username?: string;
  avatar?: string;
  bio?: string;
  role?: UserRole;
}

export interface Circle {
  id: string;
  name: string;
  description?: string;
  type: 'public' | 'private';
  tags?: string[];
  created_by: string;
  goals?: Record<string, any>;
  member_count: number;
  post_count: number;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  category_id?: string;
  circle_id?: string;
  title?: string;
  content: string;
  post_type: PostType;
  assets?: Record<string, any>;
  market_symbols?: string[];
  likes: number;
  comment_count: number;
  share_count: number;
  view_count: number;
  expert_verified: boolean;
  is_pinned: boolean;
  visibility: PostVisibility;
  created_at: string;
  updated_at: string;
}

export interface Portfolio {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  total_value: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExpertService {
  id: string;
  expert_id: string;
  service_type: ServiceType;
  title: string;
  description?: string;
  price: number;
  duration_minutes?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OnboardingData {
  financial_goals: {
    primary_goal: string;
    investment_timeline: string;
    target_amount?: number;
  };
  risk_profile: RiskProfile;
  experience_level: string;
  preferred_topics: string[];
}
