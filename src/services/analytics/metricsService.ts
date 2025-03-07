
import { supabase } from '@/integrations/supabase/client';
import { AnalyticsMetric } from '@/types';

/**
 * Get all metrics for a specific date range
 * @param startDate - Start date for metrics (inclusive)
 * @param endDate - End date for metrics (inclusive)
 * @returns Promise with metrics data
 */
export const getMetrics = async (
  startDate: string,
  endDate: string
): Promise<AnalyticsMetric[]> => {
  try {
    // Use the any type as a workaround for TS errors with tables not defined in types
    const { data, error } = await (supabase as any)
      .from('analytics_metrics')
      .select()
      .gte('date_recorded', startDate)
      .lte('date_recorded', endDate)
      .order('date_recorded', { ascending: false });

    if (error) throw error;
    return data as AnalyticsMetric[];
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return [];
  }
};

/**
 * Get metrics grouped by metric type and name
 * @param days - Number of days to fetch (defaults to 30)
 * @returns Promise with grouped metrics data
 */
export const getMetricsSummary = async (days = 30): Promise<Record<string, any>> => {
  try {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const { data, error } = await (supabase as any)
      .from('analytics_metrics')
      .select()
      .gte('date_recorded', startDate)
      .lte('date_recorded', endDate);

    if (error) throw error;

    // Group metrics by type and name
    const metrics = data as AnalyticsMetric[];
    return metrics.reduce((acc, metric) => {
      const { metric_type, metric_name, metric_value } = metric;
      
      if (!acc[metric_type]) {
        acc[metric_type] = {};
      }
      
      if (!acc[metric_type][metric_name]) {
        acc[metric_type][metric_name] = [];
      }
      
      acc[metric_type][metric_name].push({
        date: metric.date_recorded,
        value: metric_value,
        entity_id: metric.entity_id,
        entity_type: metric.entity_type
      });
      
      return acc;
    }, {} as Record<string, any>);
  } catch (error) {
    console.error('Error fetching metrics summary:', error);
    return {};
  }
};

/**
 * Get engagement metrics (posts, likes, comments, shares, bookmarks)
 * @param days - Number of days to fetch (defaults to 7)
 * @returns Promise with engagement metrics data
 */
export const getEngagementMetrics = async (days = 7): Promise<any> => {
  try {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const { data, error } = await (supabase as any)
      .from('analytics_metrics')
      .select()
      .eq('metric_type', 'engagement')
      .gte('date_recorded', startDate)
      .lte('date_recorded', endDate)
      .order('date_recorded', { ascending: true });

    if (error) throw error;

    // Organize metrics by date and name
    const metrics = data as AnalyticsMetric[];
    const dateMap: Record<string, Record<string, number>> = {};
    
    metrics.forEach(metric => {
      const { date_recorded, metric_name, metric_value } = metric;
      if (!dateMap[date_recorded]) {
        dateMap[date_recorded] = {};
      }
      dateMap[date_recorded][metric_name] = Number(metric_value);
    });
    
    // Convert to array for charts
    return Object.entries(dateMap).map(([date, values]) => ({
      date,
      ...values
    }));
  } catch (error) {
    console.error('Error fetching engagement metrics:', error);
    return [];
  }
};

/**
 * Get top circles by engagement
 * @param limit - Number of circles to fetch (defaults to 5)
 * @returns Promise with top circles data
 */
export const getTopCircles = async (limit = 5): Promise<any[]> => {
  try {
    const { data, error } = await (supabase as any)
      .from('analytics_metrics')
      .select('*, circles(*)')
      .eq('metric_type', 'community')
      .eq('metric_name', 'circle_engagement')
      .eq('date_recorded', new Date().toISOString().split('T')[0])
      .order('metric_value', { ascending: false })
      .limit(limit);

    if (error) throw error;

    if (!data || data.length === 0) {
      return [];
    }

    // Get circle details for each metric
    const metrics = data as unknown as any[];
    return metrics.map(metric => ({
      id: metric.entity_id,
      name: metric.circles?.name || 'Unknown Circle',
      engagement: Number(metric.metric_value),
      entity_id: metric.entity_id
    }));
  } catch (error) {
    console.error('Error fetching top circles:', error);
    return [];
  }
};

/**
 * Trigger metrics update via edge function
 * @returns Promise with result of update operation
 */
export const triggerMetricsUpdate = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const { data, error } = await supabase.functions.invoke('update-metrics', {
      method: 'POST',
    });

    if (error) throw error;
    
    return {
      success: true,
      message: 'Metrics updated successfully'
    };
  } catch (error) {
    console.error('Error triggering metrics update:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
