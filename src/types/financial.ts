
export interface RiskAssessmentQuestion {
  id: string;
  text: string;
  options: {
    text: string;
    score: number;
  }[];
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface UserExtended {
  id: string;
  full_name: string;
  email: string;
  location?: string;
  profession?: string;
  risk_profile?: 'conservative' | 'moderate' | 'aggressive';
  financial_goals: Record<string, any>;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface TrackedAsset {
  id: string;
  user_id: string;
  ticker: string;
  quantity: number;
  purchase_price?: number;
  current_price?: number;
  asset_type: 'stock' | 'crypto' | 'mutual_fund' | 'bond' | 'commodity';
  purchase_date: string;
  created_at: string;
  updated_at: string;
}

export interface FinancialMetrics {
  id: string;
  user_id: string;
  portfolio_size: number;
  asset_allocation: Record<string, number>;
  investment_returns: number;
  annualized_returns: number;
  calculated_at: string;
}

export interface PublicProfile {
  id: string;
  user_id: string;
  is_public: boolean;
  visible_sections: string[];
  showcase_metrics: Record<string, any>;
  profile_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_type: string;
  badge_name: string;
  badge_icon?: string;
  description?: string;
  earned_at: string;
  criteria_met: Record<string, any>;
}

export interface EmailIntegration {
  id: string;
  user_id: string;
  provider: string;
  access_token?: string;
  refresh_token?: string;
  token_expires_at?: string;
  is_active: boolean;
  last_sync?: string;
  created_at: string;
}

export interface ParsedTransaction {
  id: string;
  user_id: string;
  ticker: string;
  quantity: number;
  price: number;
  transaction_type: 'buy' | 'sell';
  broker?: string;
  transaction_date?: string;
  email_message_id?: string;
  created_at: string;
}
