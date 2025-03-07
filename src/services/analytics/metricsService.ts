
import { supabase } from '@/integrations/supabase/client';
import { AnalyticsMetric } from '@/types';

export const metricsService = {
  /**
   * Get engagement metrics
   */
  async getEngagementMetrics(days: number = 30): Promise<AnalyticsMetric[]> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const formattedStartDate = startDate.toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('analytics_metrics')
        .select('*')
        .eq('metric_type', 'engagement')
        .gte('date_recorded', formattedStartDate)
        .order('date_recorded', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting engagement metrics:', error);
      return [];
    }
  },

  /**
   * Get community metrics
   */
  async getCommunityMetrics(days: number = 30): Promise<AnalyticsMetric[]> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const formattedStartDate = startDate.toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('analytics_metrics')
        .select('*')
        .eq('metric_type', 'community')
        .gte('date_recorded', formattedStartDate)
        .order('date_recorded', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting community metrics:', error);
      return [];
    }
  },

  /**
   * Get top circles by engagement
   */
  async getTopCirclesByEngagement(): Promise<{circleName: string; score: number}[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('analytics_metrics')
        .select(`
          metric_value,
          entity_id,
          circles:entity_id(name)
        `)
        .eq('metric_type', 'community')
        .eq('metric_name', 'circle_engagement')
        .eq('date_recorded', today)
        .order('metric_value', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      return data?.map(item => ({
        circleName: item.circles?.name || 'Unknown',
        score: item.metric_value
      })) || [];
    } catch (error) {
      console.error('Error getting top circles:', error);
      return [];
    }
  },

  /**
   * Get user activity metrics
   */
  async getUserActivityMetrics(days: number = 30): Promise<AnalyticsMetric[]> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const formattedStartDate = startDate.toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('analytics_metrics')
        .select('*')
        .eq('metric_type', 'user')
        .gte('date_recorded', formattedStartDate)
        .order('date_recorded', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting user metrics:', error);
      return [];
    }
  },

  /**
   * Get content metrics
   */
  async getContentMetrics(days: number = 30): Promise<AnalyticsMetric[]> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const formattedStartDate = startDate.toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('analytics_metrics')
        .select('*')
        .eq('metric_type', 'content')
        .gte('date_recorded', formattedStartDate)
        .order('date_recorded', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting content metrics:', error);
      return [];
    }
  },
  
  /**
   * Get all metrics for dashboard
   */
  async getDashboardMetrics(days: number = 30): Promise<{
    engagement: AnalyticsMetric[];
    community: AnalyticsMetric[];
    users: AnalyticsMetric[];
    content: AnalyticsMetric[];
  }> {
    try {
      const [engagement, community, users, content] = await Promise.all([
        this.getEngagementMetrics(days),
        this.getCommunityMetrics(days),
        this.getUserActivityMetrics(days),
        this.getContentMetrics(days)
      ]);
      
      return {
        engagement,
        community,
        users,
        content
      };
    } catch (error) {
      console.error('Error getting dashboard metrics:', error);
      return {
        engagement: [],
        community: [],
        users: [],
        content: []
      };
    }
  },
  
  /**
   * Trigger daily metrics update
   */
  async triggerMetricsUpdate(): Promise<boolean> {
    try {
      const { error: error1 } = await supabase.rpc('update_daily_metrics');
      if (error1) throw error1;
      
      const { error: error2 } = await supabase.rpc('update_top_circles_metrics');
      if (error2) throw error2;
      
      return true;
    } catch (error) {
      console.error('Error triggering metrics update:', error);
      return false;
    }
  }
};
