
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, UserPlus, MessageSquare, Share2, Bookmark, RefreshCw, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getEngagementMetrics, getTopCircles, triggerMetricsUpdate } from '@/services/analytics/metricsService';

const COLORS = ['#16a34a', '#0284c7', '#9333ea', '#f97316', '#6366f1'];

const Dashboard = () => {
  const { toast } = useToast();
  const [engagementData, setEngagementData] = useState<any[]>([]);
  const [topCircles, setTopCircles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [timeRange, setTimeRange] = useState('7');
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const engagement = await getEngagementMetrics(Number(timeRange));
        setEngagementData(engagement);
        setIsFallback(Array.isArray(engagement) && engagement.some(d => d.isFallback));
        const circles = await getTopCircles(5);
        setTopCircles(circles);
      } catch (error) {
        console.error('Error fetching metrics:', error);
        toast({
          title: 'Error',
          description: 'Failed to load analytics data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, [timeRange, toast]);

  const handleUpdateMetrics = async () => {
    setUpdating(true);
    try {
      const result = await triggerMetricsUpdate();
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Metrics have been updated',
        });
        const engagement = await getEngagementMetrics(Number(timeRange));
        setEngagementData(engagement);
        const circles = await getTopCircles(5);
        setTopCircles(circles);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update metrics',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const totals = engagementData.reduce(
    (acc, day) => {
      acc.posts += day.posts_created || 0;
      acc.likes += day.likes_created || 0;
      acc.comments += day.comments_created || 0;
      acc.shares += day.shares_created || 0;
      acc.bookmarks += day.bookmarks_created || 0;
      return acc;
    },
    { posts: 0, likes: 0, comments: 0, shares: 0, bookmarks: 0 }
  );

  return (
    <div className="space-y-6 px-2 md:px-6 w-full">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
        <Button onClick={handleUpdateMetrics} disabled={updating} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${updating ? 'animate-spin' : ''}`} />
          Update Metrics
        </Button>
      </div>
      {isFallback && (
        <div className="flex items-center gap-2 p-4 bg-yellow-100 border border-yellow-300 rounded-lg text-yellow-900">
          <AlertTriangle className="w-5 h-5" />
          Showing fallback/mock data. Live data is currently unavailable.
        </div>
      )}
      {/* Main dashboard content */}
      <div className="w-full">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Engagement Overview</CardTitle>
                <CardDescription>
                  View engagement trends for the selected time period
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[40vw] min-h-[300px] max-h-[500px]">
                {loading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-pulse text-ip-teal">Loading chart data...</div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={engagementData.map(d => ({ ...d, date: formatDate(d.date) }))}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="posts_created"
                        name="Posts"
                        stroke="#16a34a"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="likes_created"
                        name="Likes"
                        stroke="#0284c7"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="comments_created"
                        name="Comments"
                        stroke="#9333ea"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
          {/* Add other responsive cards/charts here as needed */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
