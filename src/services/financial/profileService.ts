
import { supabase } from '@/integrations/supabase/client';
import { UserExtended, TrackedAsset, FinancialMetrics, PublicProfile, UserAchievement } from '@/types/financial';

export class FinancialProfileService {
  // User Extended Profile Management
  static async createUserExtended(data: Partial<UserExtended>) {
    const { data: result, error } = await supabase
      .from('users_extended')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  static async getUserExtended(userId: string) {
    const { data, error } = await supabase
      .from('users_extended')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data as UserExtended;
  }

  static async updateUserExtended(userId: string, updates: Partial<UserExtended>) {
    const { data, error } = await supabase
      .from('users_extended')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Portfolio Management
  static async addTrackedAsset(asset: Omit<TrackedAsset, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('tracked_assets')
      .insert(asset)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getTrackedAssets(userId: string) {
    const { data, error } = await supabase
      .from('tracked_assets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as TrackedAsset[];
  }

  static async updateAssetPrice(assetId: string, currentPrice: number) {
    const { data, error } = await supabase
      .from('tracked_assets')
      .update({ 
        current_price: currentPrice,
        updated_at: new Date().toISOString()
      })
      .eq('id', assetId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteTrackedAsset(assetId: string) {
    const { error } = await supabase
      .from('tracked_assets')
      .delete()
      .eq('id', assetId);

    if (error) throw error;
  }

  // Financial Metrics
  static async getFinancialMetrics(userId: string) {
    const { data, error } = await supabase
      .from('financial_metrics')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as FinancialMetrics | null;
  }

  static async calculatePortfolioValue(userId: string) {
    const { data, error } = await supabase
      .rpc('calculate_portfolio_value', { p_user_id: userId });

    if (error) throw error;
    return data as number;
  }

  static async updateFinancialMetrics(userId: string) {
    const { error } = await supabase
      .rpc('update_financial_metrics', { p_user_id: userId });

    if (error) throw error;
  }

  // Public Profile Management
  static async createPublicProfile(data: Omit<PublicProfile, 'id' | 'created_at' | 'updated_at'>) {
    const { data: result, error } = await supabase
      .from('public_profile')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  static async getPublicProfile(userId: string) {
    const { data, error } = await supabase
      .from('public_profile')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as PublicProfile | null;
  }

  static async getPublicProfileByUrl(profileUrl: string) {
    const { data, error } = await supabase
      .from('public_profile')
      .select(`
        *,
        users_extended(*),
        user_achievements(*),
        financial_metrics(*)
      `)
      .eq('profile_url', profileUrl)
      .eq('is_public', true)
      .single();

    if (error) throw error;
    return data;
  }

  static async updatePublicProfile(userId: string, updates: Partial<PublicProfile>) {
    const { data, error } = await supabase
      .from('public_profile')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Achievements
  static async getUserAchievements(userId: string) {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    if (error) throw error;
    return data as UserAchievement[];
  }

  static async awardAchievement(achievement: Omit<UserAchievement, 'id' | 'earned_at'>) {
    const { data, error } = await supabase
      .from('user_achievements')
      .insert(achievement)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Achievement checking logic
  static async checkAndAwardAchievements(userId: string) {
    const metrics = await this.getFinancialMetrics(userId);
    const assets = await this.getTrackedAssets(userId);
    
    if (!metrics) return;

    const achievements = [];

    // Consistent Returns Achievement
    if (metrics.annualized_returns > 12) {
      achievements.push({
        user_id: userId,
        achievement_type: 'consistent_returns',
        badge_name: '📈 Steady Grower',
        badge_icon: '📈',
        description: '3Y returns > 12% CAGR',
        criteria_met: { annualized_returns: metrics.annualized_returns }
      });
    }

    // Diversification Achievement
    const assetTypes = new Set(assets.map(a => a.asset_type));
    if (assetTypes.size >= 3) {
      achievements.push({
        user_id: userId,
        achievement_type: 'diversification',
        badge_name: '🌍 Global Investor',
        badge_icon: '🌍',
        description: 'Holds 3+ asset classes',
        criteria_met: { asset_types: Array.from(assetTypes) }
      });
    }

    // Portfolio Size Milestones
    if (metrics.portfolio_size >= 1000000) { // 10 Lakh INR
      achievements.push({
        user_id: userId,
        achievement_type: 'portfolio_milestone',
        badge_name: '💎 Diamond Hands',
        badge_icon: '💎',
        description: 'Portfolio value exceeds ₹10 Lakh',
        criteria_met: { portfolio_size: metrics.portfolio_size }
      });
    }

    // Award new achievements (check if not already awarded)
    for (const achievement of achievements) {
      try {
        await this.awardAchievement(achievement);
      } catch (error) {
        // Achievement might already exist, ignore duplicate errors
        console.log('Achievement already exists:', achievement.achievement_type);
      }
    }
  }
}
