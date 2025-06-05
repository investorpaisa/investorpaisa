import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  PieChart,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Typography, SystemCard, SystemButton } from '@/components/ui/design-system';

export default function Home() {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();

  // Only redirect to onboarding if profile exists but onboarding is not completed
  useEffect(() => {
    if (!loading && profile) {
      // Check if onboarding is specifically false (not null/undefined)
      if (profile.onboarding_completed === false) {
        console.log('Redirecting to onboarding - onboarding_completed:', profile.onboarding_completed);
        navigate('/onboarding');
      }
    }
  }, [profile, loading, navigate]);

  // Show loading while we're checking the profile
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold to-gold/80 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-black" />
          </div>
          <Typography.Body>Loading...</Typography.Body>
        </motion.div>
      </div>
    );
  }

  // Don't render anything if we're about to redirect to onboarding
  if (profile && profile.onboarding_completed === false) {
    return null;
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'expert':
        return 'bg-gold/20 text-gold border-gold/30';
      case 'influencer':
        return 'bg-white/10 text-white border-white/30';
      default:
        return 'bg-white/5 text-white/70 border-white/20';
    }
  };

  const quickActions = [
    {
      title: 'Join Circles',
      description: 'Connect with like-minded investors',
      icon: Users,
      href: '/circles',
      gradient: 'from-gold/20 to-gold/10'
    },
    {
      title: 'Market Analysis',
      description: 'Latest market insights and trends',
      icon: TrendingUp,
      href: '/market',
      gradient: 'from-white/20 to-white/10'
    },
    {
      title: 'Learn & Grow',
      description: 'Educational content and tips',
      icon: BookOpen,
      href: '/discover',
      gradient: 'from-gold/10 to-transparent'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Welcome Header */}
        <motion.div variants={itemVariants}>
          <SystemCard variant="glass" className="p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    <Sparkles className="h-8 w-8 text-gold" />
                  </motion.div>
                  <Typography.H2>
                    Welcome back, {profile?.full_name || profile?.username}!
                  </Typography.H2>
                  <Badge className={`${getRoleColor(profile?.role || 'user')}`}>
                    {profile?.role?.charAt(0).toUpperCase() + profile?.role?.slice(1)}
                  </Badge>
                  {profile?.role === 'expert' && (
                    <Crown className="h-5 w-5 text-gold" />
                  )}
                </div>
                <Typography.Body className="text-lg">
                  Ready to grow your wealth? Let's explore today's opportunities.
                </Typography.Body>
              </div>
              <div className="text-center md:text-right">
                <Typography.Small className="text-white/60">Financial Literacy Score</Typography.Small>
                <motion.div
                  className="text-4xl font-bold text-gold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  <Typography.H2>
                    {profile?.financial_literacy_score || 'N/A'}
                    {profile?.financial_literacy_score && '/100'}
                  </Typography.H2>
                </motion.div>
              </div>
            </div>
          </SystemCard>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer"
                onClick={() => navigate(action.href)}
              >
                <SystemCard variant="default" className="hover:border-gold/30 transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <Typography.H3 className="text-lg mb-1">{action.title}</Typography.H3>
                      <Typography.Small>{action.description}</Typography.Small>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gold" />
                  </div>
                </SystemCard>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="feed" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-black/50 border border-white/10">
              <TabsTrigger value="feed" className="data-[state=active]:bg-gold data-[state=active]:text-black">Feed</TabsTrigger>
              <TabsTrigger value="portfolio" className="data-[state=active]:bg-gold data-[state=active]:text-black">Portfolio</TabsTrigger>
              <TabsTrigger value="goals" className="data-[state=active]:bg-gold data-[state=active]:text-black">Goals</TabsTrigger>
              <TabsTrigger value="alerts" className="data-[state=active]:bg-gold data-[state=active]:text-black">Alerts</TabsTrigger>
            </TabsList>

            {/* Tab contents remain the same with updated styling */}
            <TabsContent value="feed" className="space-y-4">
              <SystemCard>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <TrendingUp className="h-5 w-5 text-gold" />
                    <span>Latest from Your Network</span>
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    Recent posts from circles and people you follow
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-white/60">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Users className="h-16 w-16 mx-auto mb-4 text-gold/50" />
                    </motion.div>
                    <Typography.Body className="mb-4">No recent activity in your network.</Typography.Body>
                    <SystemButton onClick={() => navigate('/feed')}>
                      Explore Feed
                    </SystemButton>
                  </div>
                </CardContent>
              </SystemCard>
            </TabsContent>

            {/* Other tab contents with similar styling updates */}
            <TabsContent value="portfolio" className="space-y-4">
              <SystemCard>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <PieChart className="h-5 w-5 text-gold" />
                    <span>Portfolio Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <PieChart className="h-16 w-16 mx-auto mb-4 text-gold/50" />
                    <Typography.Body className="mb-4">No portfolio data available.</Typography.Body>
                    <SystemButton>Create Portfolio</SystemButton>
                  </div>
                </CardContent>
              </SystemCard>
            </TabsContent>

            {/* Goals and Alerts tabs with similar updates */}
            <TabsContent value="goals" className="space-y-4">
              <SystemCard>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Target className="h-5 w-5 text-gold" />
                    <span>Financial Goals</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <Typography.H3 className="text-base">Primary Goal</Typography.H3>
                      <Typography.Small className="capitalize">
                        {typeof profile?.financial_goals === 'object' && profile?.financial_goals
                          ? (profile.financial_goals as any).primary_goal?.replace('_', ' ')
                          : 'Not set'}
                      </Typography.Small>
                    </div>
                  </div>
                </CardContent>
              </SystemCard>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-4">
              <SystemCard>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Bell className="h-5 w-5 text-gold" />
                    <span>Market Alerts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Bell className="h-16 w-16 mx-auto mb-4 text-gold/50" />
                    <Typography.Body className="mb-4">No active alerts.</Typography.Body>
                    <SystemButton>Set Up Alerts</SystemButton>
                  </div>
                </CardContent>
              </SystemCard>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
}
