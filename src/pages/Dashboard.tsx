
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer,
  Legend
} from 'recharts';
import { TrendingUp, UserPlus, MessageSquare, Share2, Bookmark, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getEngagementMetrics, getTopCircles, triggerMetricsUpdate } from '@/services/analytics/metricsService';

// Chart colors
const COLORS = ['#16a34a', '#0284c7', '#9333ea', '#f97316', '#6366f1'];

const Dashboard = () => {
  const { toast } = useToast();
  const [engagementData, setEngagementData] = useState<any[]>([]);
  const [topCircles, setTopCircles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [timeRange, setTimeRange] = useState('7');

  // Fetch metrics data
  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        // Get engagement metrics
        const engagement = await getEngagementMetrics(Number(timeRange));
        setEngagementData(engagement);
        
        // Get top circles
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

  // Update metrics
  const handleUpdateMetrics = async () => {
    setUpdating(true);
    try {
      const result = await triggerMetricsUpdate();
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Metrics have been updated',
        });
        
        // Refresh data
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

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Calculate totals for each metric
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
        <Button onClick={handleUpdateMetrics} disabled={updating} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${updating ? 'animate-spin' : ''}`} />
          Update Metrics
        </Button>
      </div>

      {/* Time Range Selection */}
      <Tabs defaultValue="7" className="w-full" onValueChange={setTimeRange}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="7">Last 7 Days</TabsTrigger>
          <TabsTrigger value="14">Last 14 Days</TabsTrigger>
          <TabsTrigger value="30">Last 30 Days</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-ip-teal" />
              <div className="text-2xl font-bold ml-2">{totals.posts}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Likes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-ip-blue" />
              <div className="text-2xl font-bold ml-2">{totals.likes}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Comments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 text-purple-500" />
              <div className="text-2xl font-bold ml-2">{totals.comments}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Shares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Share2 className="h-5 w-5 text-orange-500" />
              <div className="text-2xl font-bold ml-2">{totals.shares}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Bookmarks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Bookmark className="h-5 w-5 text-indigo-500" />
              <div className="text-2xl font-bold ml-2">{totals.bookmarks}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Metrics Over Time */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Engagement Metrics Over Time</CardTitle>
            <CardDescription>
              View engagement trends for the selected time period
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
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
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="comments_created"
                    name="Comments"
                    stroke="#9333ea"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="shares_created"
                    name="Shares"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="bookmarks_created"
                    name="Bookmarks"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Top Circles */}
        <Card>
          <CardHeader>
            <CardTitle>Top Circles by Engagement</CardTitle>
            <CardDescription>
              Most active circles based on posts, likes, and comments
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-pulse text-ip-teal">Loading chart data...</div>
              </div>
            ) : topCircles.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topCircles}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis type="number" />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 14 }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="engagement" fill="#16a34a" name="Engagement Score" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">No circle engagement data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Engagement Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Distribution</CardTitle>
            <CardDescription>
              Breakdown of different engagement types
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-pulse text-ip-teal">Loading chart data...</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Posts', value: totals.posts },
                      { name: 'Likes', value: totals.likes },
                      { name: 'Comments', value: totals.comments },
                      { name: 'Shares', value: totals.shares },
                      { name: 'Bookmarks', value: totals.bookmarks },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[
                      { name: 'Posts', value: totals.posts },
                      { name: 'Likes', value: totals.likes },
                      { name: 'Comments', value: totals.comments },
                      { name: 'Shares', value: totals.shares },
                      { name: 'Bookmarks', value: totals.bookmarks },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
