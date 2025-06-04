
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  Users,
  BookOpen,
  Bell,
  ArrowRight,
  Crown,
  Target,
  PieChart
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  // Redirect to onboarding if not completed
  useEffect(() => {
    if (profile && !profile.onboarding_completed) {
      navigate('/onboarding');
    }
  }, [profile, navigate]);

  if (!profile?.onboarding_completed) {
    return null; // Will redirect to onboarding
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'expert':
        return 'bg-yellow-100 text-yellow-800';
      case 'influencer':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const quickActions = [
    {
      title: 'Join Circles',
      description: 'Connect with like-minded investors',
      icon: Users,
      href: '/circles',
      color: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      title: 'Market Analysis',
      description: 'Latest market insights and trends',
      icon: TrendingUp,
      href: '/market',
      color: 'bg-green-50 hover:bg-green-100'
    },
    {
      title: 'Learn & Grow',
      description: 'Educational content and tips',
      icon: BookOpen,
      href: '/discover',
      color: 'bg-purple-50 hover:bg-purple-100'
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold">
                Welcome back, {profile?.full_name || profile?.username}!
              </h1>
              <Badge className={`${getRoleColor(profile?.role || 'user')} border-white`}>
                {profile?.role?.charAt(0).toUpperCase() + profile?.role?.slice(1)}
              </Badge>
              {profile?.role === 'expert' && (
                <Crown className="h-5 w-5 text-yellow-300" />
              )}
            </div>
            <p className="text-green-100">
              Ready to grow your wealth? Let's explore today's opportunities.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <p className="text-sm text-green-100">Financial Literacy Score</p>
              <p className="text-3xl font-bold">
                {profile?.financial_literacy_score || 'N/A'}
                {profile?.financial_literacy_score && '/100'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Card
              key={index}
              className={`cursor-pointer transition-colors ${action.color}`}
              onClick={() => navigate(action.href)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Icon className="h-8 w-8 text-gray-600" />
                  <div>
                    <h3 className="font-semibold">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="feed" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Latest from Your Network</span>
              </CardTitle>
              <CardDescription>
                Recent posts from circles and people you follow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>No recent activity in your network.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate('/feed')}
                >
                  Explore Feed
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5" />
                <span>Portfolio Overview</span>
              </CardTitle>
              <CardDescription>
                Track your investments and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>No portfolio data available.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                >
                  Create Portfolio
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Financial Goals</span>
              </CardTitle>
              <CardDescription>
                Track progress towards your financial objectives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium">Primary Goal</h4>
                  <p className="text-sm text-muted-foreground capitalize">
                    {typeof profile?.financial_goals === 'object' && profile?.financial_goals
                      ? (profile.financial_goals as any).primary_goal?.replace('_', ' ')
                      : 'Not set'}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium">Risk Profile</h4>
                  <p className="text-sm text-muted-foreground capitalize">
                    {profile?.risk_profile?.replace('_', ' ') || 'Not set'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Market Alerts</span>
              </CardTitle>
              <CardDescription>
                Stay updated with personalized notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>No active alerts.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                >
                  Set Up Alerts
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
