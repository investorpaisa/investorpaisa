
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
        return 'bg-gold/20 text-gold border-gold/30';
      case 'influencer':
        return 'bg-white/10 text-white border-white/30';
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
        <motion.div 
          variants={itemVariants}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-black via-gray-900 to-black border border-gold/20 p-8"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent"></div>
          <div className="relative z-10">
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
                  <h1 className="text-3xl font-bold text-white">
                    Welcome back, {profile?.full_name || profile?.username}!
                  </h1>
                  <Badge className={`${getRoleColor(profile?.role || 'user')}`}>
                    {profile?.role?.charAt(0).toUpperCase() + profile?.role?.slice(1)}
                  </Badge>
                  {profile?.role === 'expert' && (
                    <Crown className="h-5 w-5 text-gold" />
                  )}
                </div>
                <p className="text-white/70 text-lg">
                  Ready to grow your wealth? Let's explore today's opportunities.
                </p>
              </div>
              <div className="text-center md:text-right">
                <p className="text-sm text-white/60">Financial Literacy Score</p>
                <motion.p 
                  className="text-4xl font-bold text-gold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  {profile?.financial_literacy_score || 'N/A'}
                  {profile?.financial_literacy_score && '/100'}
                </motion.p>
              </div>
            </div>
          </div>
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
                <Card className="bg-gray-900/50 border-white/10 hover:border-gold/30 transition-all duration-300 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{action.title}</h3>
                        <p className="text-sm text-white/60">{action.description}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gold" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="feed" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-gray-900/50 border border-white/10">
              <TabsTrigger value="feed" className="data-[state=active]:bg-gold data-[state=active]:text-black">Feed</TabsTrigger>
              <TabsTrigger value="portfolio" className="data-[state=active]:bg-gold data-[state=active]:text-black">Portfolio</TabsTrigger>
              <TabsTrigger value="goals" className="data-[state=active]:bg-gold data-[state=active]:text-black">Goals</TabsTrigger>
              <TabsTrigger value="alerts" className="data-[state=active]:bg-gold data-[state=active]:text-black">Alerts</TabsTrigger>
            </TabsList>

            <TabsContent value="feed" className="space-y-4">
              <Card className="bg-gray-900/50 border-white/10">
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
                    <p className="mb-4">No recent activity in your network.</p>
                    <Button
                      variant="outline"
                      className="border-gold/30 text-gold hover:bg-gold hover:text-black"
                      onClick={() => navigate('/feed')}
                    >
                      Explore Feed
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-4">
              <Card className="bg-gray-900/50 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <PieChart className="h-5 w-5 text-gold" />
                    <span>Portfolio Overview</span>
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    Track your investments and performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-white/60">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <PieChart className="h-16 w-16 mx-auto mb-4 text-gold/50" />
                    </motion.div>
                    <p className="mb-4">No portfolio data available.</p>
                    <Button
                      variant="outline"
                      className="border-gold/30 text-gold hover:bg-gold hover:text-black"
                    >
                      Create Portfolio
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="goals" className="space-y-4">
              <Card className="bg-gray-900/50 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Target className="h-5 w-5 text-gold" />
                    <span>Financial Goals</span>
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    Track progress towards your financial objectives
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <h4 className="font-medium text-white">Primary Goal</h4>
                      <p className="text-sm text-white/60 capitalize">
                        {typeof profile?.financial_goals === 'object' && profile?.financial_goals
                          ? (profile.financial_goals as any).primary_goal?.replace('_', ' ')
                          : 'Not set'}
                      </p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <h4 className="font-medium text-white">Risk Profile</h4>
                      <p className="text-sm text-white/60 capitalize">
                        {profile?.risk_profile?.replace('_', ' ') || 'Not set'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-4">
              <Card className="bg-gray-900/50 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Bell className="h-5 w-5 text-gold" />
                    <span>Market Alerts</span>
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    Stay updated with personalized notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-white/60">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Bell className="h-16 w-16 mx-auto mb-4 text-gold/50" />
                    </motion.div>
                    <p className="mb-4">No active alerts.</p>
                    <Button
                      variant="outline"
                      className="border-gold/30 text-gold hover:bg-gold hover:text-black"
                    >
                      Set Up Alerts
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
}
