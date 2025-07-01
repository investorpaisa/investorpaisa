
import React from 'react';
import { InvestorPaisaHeader } from '@/components/layout/InvestorPaisaHeader';
import { CreatePostWidget } from '@/components/posts/CreatePostWidget';
import { ProfessionalFeedCard } from '@/components/feed/ProfessionalFeedCard';
import { ProfileSidebar } from '@/components/profile/ProfileSidebar';
import { MarketWidget } from '@/components/market/MarketWidget';
import { NetworkSuggestions } from '@/components/network/NetworkSuggestions';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, Users, BookOpen, Target, 
  DollarSign, BarChart3, Award, Bell
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ProfessionalPost } from '@/types/professional';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

export const InvestorPaisaHome: React.FC = () => {
  const { profile } = useAuth();
  const [feedPosts, setFeedPosts] = useState<ProfessionalPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for finance-focused feed
  useEffect(() => {
    const loadFeedData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPosts: ProfessionalPost[] = [
        {
          id: '1',
          author: {
            id: '2',
            username: 'rajesh_financial',
            full_name: 'Rajesh Kumar',
            headline: 'Senior Financial Advisor at HDFC Bank',
            avatar_url: '/placeholder.svg',
            current_company: 'HDFC Bank',
            location: 'Mumbai, India',
            industry: 'Banking & Finance',
            followers: 2847,
            following: 543,
            connections: 1892,
            is_verified: true,
            premium_member: true,
            experience_years: 8
          },
          content: `🎯 Market Update: Nifty50 crosses 22,000 for the first time!

Key highlights from today's session:
• Banking stocks leading the rally (+2.3%)
• IT sector showing strong momentum (+1.8%)
• FII inflows continue for 5th consecutive day
• Rupee strengthens against USD

Investment Strategy for Q1 2025:
1. Focus on large-cap banking stocks
2. Consider defensive plays in FMCG
3. Keep watching for correction opportunities
4. Maintain 60-40 equity-debt allocation

What's your take on the current market momentum? Are you positioning for a pullback or riding the wave?

#Nifty50 #MarketUpdate #InvestmentStrategy #BankingStocks #FinancialPlanning`,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          likes: 234,
          comments: 45,
          reposts: 12,
          is_liked: false,
          is_saved: false,
          visibility: 'public',
          hashtags: ['Nifty50', 'MarketUpdate', 'InvestmentStrategy', 'BankingStocks']
        },
        {
          id: '2',
          author: {
            id: '3',
            username: 'priya_wealth',
            full_name: 'Priya Sharma',
            headline: 'Wealth Manager | Certified Financial Planner',
            avatar_url: '/placeholder.svg',
            current_company: 'Kotak Wealth Management',
            location: 'Delhi, India',
            industry: 'Wealth Management',
            followers: 1856,
            following: 234,
            connections: 1243,
            is_verified: false,
            premium_member: false,
            experience_years: 6
          },
          content: `💡 Tax Saving Season Alert! 

With just 2 months left in FY24, here's your quick checklist:

✅ Section 80C (₹1.5L limit)
• ELSS Mutual Funds
• PPF contributions
• Life insurance premiums
• Home loan principal

✅ Section 80D (Medical Insurance)
• ₹25K for self & family
• Additional ₹50K for parents (60+)

✅ Section 80CCD(1B) - NPS
• Extra ₹50K deduction
• Great for retirement planning

✅ Section 24B - Home Loan Interest
• Up to ₹2L for self-occupied property

Pro Tip: Don't invest just for tax saving! Choose instruments that align with your financial goals.

Need help with tax planning? DM me! 

#TaxPlanning #Section80C #ELSS #FinancialPlanning #TaxSaving #NPS`,
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          likes: 156,
          comments: 28,
          reposts: 8,
          is_liked: true,
          is_saved: true,
          visibility: 'public',
          hashtags: ['TaxPlanning', 'Section80C', 'ELSS', 'FinancialPlanning']
        }
      ];

      setFeedPosts(mockPosts);
      setLoading(false);
    };

    loadFeedData();
  }, []);

  const handleLike = (postId: string) => {
    setFeedPosts(posts => 
      posts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              is_liked: !post.is_liked, 
              likes: post.is_liked ? post.likes - 1 : post.likes + 1 
            }
          : post
      )
    );
    toast.success('Post liked!');
  };

  const handleComment = (postId: string) => {
    console.log('Comment on post:', postId);
    toast.info('Comment feature coming soon!');
  };

  const handleShare = (postId: string) => {
    console.log('Share post:', postId);
    toast.info('Share feature coming soon!');
  };

  const handleSave = (postId: string) => {
    setFeedPosts(posts => 
      posts.map(post => 
        post.id === postId 
          ? { ...post, is_saved: !post.is_saved }
          : post
      )
    );
    toast.success('Post saved!');
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to continue</h2>
          <Button onClick={() => window.location.href = '/login'}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <InvestorPaisaHeader />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Profile & Quick Stats */}
          <div className="col-span-12 lg:col-span-3">
            <div className="space-y-4 sticky top-24">
              <ProfileSidebar />
              
              {/* Finance-focused Quick Stats */}
              <Card className="bg-white border border-gray-200">
                <CardHeader className="pb-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                    Your Finance Hub
                  </h4>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-gray-600">Portfolio Views</span>
                      </div>
                      <span className="text-sm font-semibold text-blue-600">+12%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-gray-600">Market Insights</span>
                      </div>
                      <span className="text-sm font-semibold text-green-600">+25%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-purple-600" />
                        <span className="text-sm text-gray-600">Network Growth</span>
                      </div>
                      <span className="text-sm font-semibold text-purple-600">+8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content - Finance-focused Feed */}
          <div className="col-span-12 lg:col-span-6">
            <div className="space-y-6">
              <CreatePostWidget />
              
              {/* Finance News Highlights */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 flex items-center">
                      <Bell className="h-4 w-4 mr-2 text-blue-600" />
                      Market Alert
                    </h3>
                    <Badge className="bg-blue-100 text-blue-800">Live</Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">
                    Sensex gains 500+ points as banking stocks rally. RBI policy decision expected this week.
                  </p>
                  <Button variant="outline" size="sm" className="text-blue-600 border-blue-200">
                    View Market Dashboard
                  </Button>
                </CardContent>
              </Card>
              
              {/* Feed Posts */}
              {loading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map(i => (
                    <Card key={i} className="bg-white border border-gray-200">
                      <CardContent className="p-6">
                        <div className="animate-pulse">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                            <div className="space-y-2">
                              <div className="h-4 bg-gray-200 rounded w-32"></div>
                              <div className="h-3 bg-gray-200 rounded w-24"></div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {feedPosts.map(post => (
                    <ProfessionalFeedCard
                      key={post.id}
                      post={post}
                      onLike={handleLike}
                      onComment={handleComment}
                      onShare={handleShare}
                      onSave={handleSave}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Finance Tools & Suggestions */}
          <div className="col-span-12 lg:col-span-3">
            <div className="space-y-6 sticky top-24">
              <MarketWidget />
              <NetworkSuggestions />
              
              {/* Finance Learning Resources */}
              <Card className="bg-white border border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-orange-600" />
                    <h4 className="font-semibold text-gray-900">Finance Learning</h4>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      <h5 className="text-sm font-medium text-gray-900 mb-1">
                        Understanding SIP vs Lump Sum
                      </h5>
                      <p className="text-xs text-gray-600">
                        Learn the pros and cons of systematic investment plans
                      </p>
                      <span className="text-xs text-gray-500">5 min read • 2,134 views</span>
                    </div>
                    
                    <div className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      <h5 className="text-sm font-medium text-gray-900 mb-1">
                        Tax Saving Mutual Funds Guide
                      </h5>
                      <p className="text-xs text-gray-600">
                        Complete guide to ELSS funds and tax benefits
                      </p>
                      <span className="text-xs text-gray-500">8 min read • 1,892 views</span>
                    </div>
                  </div>
                  
                  <Button variant="ghost" className="w-full mt-4 text-sm text-orange-600">
                    Explore All Courses
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
