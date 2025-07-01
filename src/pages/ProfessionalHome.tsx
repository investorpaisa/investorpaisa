
import React, { useState, useEffect } from 'react';
import { ProfessionalHeader } from '@/components/layout/ProfessionalHeader';
import { CreatePostWidget } from '@/components/posts/CreatePostWidget';
import { ProfessionalFeedCard } from '@/components/feed/ProfessionalFeedCard';
import { ProfessionalProfileSidebar } from '@/components/professional/ProfessionalProfileSidebar';
import { NetworkingSuggestions } from '@/components/professional/NetworkingSuggestions';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, Users, Briefcase, Calendar,
  BookOpen, Award, Target, Bell
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ProfessionalPost } from '@/types/professional';
import { toast } from 'sonner';

export const ProfessionalHome: React.FC = () => {
  const { profile } = useAuth();
  const [feedPosts, setFeedPosts] = useState<ProfessionalPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - in a real app, this would come from API
  useEffect(() => {
    const loadFeedData = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPosts: ProfessionalPost[] = [
        {
          id: '1',
          author: {
            id: '2',
            username: 'priya_patel',
            full_name: 'Priya Patel',
            headline: 'Investment Banking Analyst at Goldman Sachs',
            avatar_url: '/placeholder.svg',
            current_company: 'Goldman Sachs',
            location: 'Mumbai, India',
            industry: 'Investment Banking',
            followers: 1247,
            following: 543,
            connections: 892,
            is_verified: true,
            premium_member: true,
            experience_years: 5
          },
          content: `Exciting news! Our team just closed a $50M Series B funding round for a promising fintech startup focused on digital banking solutions for underserved communities.

This deal highlights the incredible potential in the fintech space, especially for companies that are addressing real-world problems with innovative technology. The startup's vision to provide accessible banking services aligns perfectly with the growing demand for financial inclusion.

Key takeaways from this experience:
• Market timing is crucial - fintech adoption has accelerated post-pandemic
• Strong leadership and clear vision attract investors
• Technology that solves real problems has lasting value
• Regulatory compliance remains a critical success factor

What are your thoughts on the evolving fintech landscape? Are we seeing a shift towards more socially responsible investments?

#fintech #investment #banking #financialinclusion #startup #venturecapital`,
          image_url: '/placeholder.svg',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          likes: 234,
          comments: 45,
          reposts: 12,
          is_liked: false,
          is_saved: false,
          visibility: 'public',
          hashtags: ['fintech', 'investment', 'banking', 'financialinclusion', 'startup']
        },
        {
          id: '2',
          author: {
            id: '3',
            username: 'amit_verma',
            full_name: 'Amit Kumar Verma',
            headline: 'Portfolio Manager at Axis Mutual Fund',
            avatar_url: '/placeholder.svg',
            current_company: 'Axis Mutual Fund',
            location: 'Delhi, India',
            industry: 'Asset Management',
            followers: 2156,
            following: 234,
            connections: 1543,
            is_verified: false,
            premium_member: false,
            experience_years: 8
          },
          content: `Market volatility presents both challenges and opportunities for long-term investors. In times like these, having a well-diversified portfolio and maintaining discipline becomes even more crucial.

Here are my top 3 strategies for navigating uncertain markets:

1. **Systematic Investment Planning (SIP)**: Continue with regular investments regardless of market conditions. This helps average out the cost and reduces timing risk.

2. **Asset Allocation Review**: Rebalance your portfolio quarterly. Market movements can shift your allocation away from your target, affecting long-term returns.

3. **Quality over Quantity**: Focus on fundamentally strong companies with sustainable competitive advantages. They tend to weather storms better.

Remember: Time in the market beats timing the market. 

What's your approach to managing portfolio volatility? Share your thoughts below! 👇`,
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
          likes: 156,
          comments: 28,
          reposts: 8,
          is_liked: true,
          is_saved: true,
          visibility: 'public',
          hashtags: ['investing', 'portfolio', 'SIP', 'volatility', 'wealth']
        },
        {
          id: '3',
          author: {
            id: '4',
            username: 'sarah_tech',
            full_name: 'Sarah Johnson',
            headline: 'Senior Product Manager at Microsoft',
            avatar_url: '/placeholder.svg',
            current_company: 'Microsoft',
            location: 'Bangalore, India',
            industry: 'Technology',
            followers: 3421,
            following: 876,
            connections: 2109,
            is_verified: true,
            premium_member: true,
            experience_years: 7
          },
          content: `Just wrapped up an incredible quarter leading the launch of our new AI-powered productivity features! 🚀

Working with cross-functional teams across engineering, design, and data science has been an amazing journey. Here are some key learnings from this experience:

✅ Clear communication is everything when working with diverse teams
✅ User feedback loops early in development save months of work later
✅ Technical constraints can actually drive more creative solutions
✅ Building for accessibility from day one isn't just good practice - it's good business

The features we shipped have already improved productivity for over 10M users worldwide. Nothing beats the feeling of knowing your work is making a real difference!

To my fellow PMs: What's the most challenging cross-functional project you've worked on recently?`,
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
          likes: 412,
          comments: 67,
          reposts: 23,
          is_liked: false,
          is_saved: false,
          visibility: 'public',
          hashtags: ['productmanagement', 'AI', 'productivity', 'microsoft', 'teamwork']
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

  // Create userProfile with safe property access and mock professional data
  const userProfile = {
    id: profile?.id || '1',
    name: profile?.full_name || 'Your Name',
    title: 'Professional', // Mock headline
    company: 'Your Company', // Mock company
    avatar: profile?.avatar_url || '/placeholder.svg',
    banner: '/placeholder.svg',
    connections: 0, // Mock connection count
    profileViews: 89,
    postImpressions: 2341,
    skills: ['Financial Planning', 'Investment Advisory', 'Risk Management', 'Portfolio Analysis', 'Tax Planning'],
    premium: false // Mock premium status
  };

  const networkingSuggestions = [
    {
      id: '1',
      name: 'Kavitha Nair',
      title: 'Senior Financial Planner',
      company: 'ICICI Prudential',
      avatar: '/placeholder.svg',
      mutualConnections: 15,
      reason: 'You both work in financial services',
      location: 'Mumbai, India',
      verified: true
    },
    {
      id: '2',
      name: 'Vikram Singh',
      title: 'Fund Manager',
      company: 'SBI Mutual Fund',
      avatar: '/placeholder.svg',
      mutualConnections: 8,
      reason: 'You have 8 mutual connections',
      location: 'Delhi, India',
      verified: false
    },
    {
      id: '3',
      name: 'Ananya Sharma',
      title: 'Investment Analyst',
      company: 'Kotak Securities',
      avatar: '/placeholder.svg',
      mutualConnections: 23,
      reason: 'Works at a company you follow',
      location: 'Bangalore, India',
      verified: true
    }
  ];

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
      <ProfessionalHeader />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Profile & Navigation */}
          <div className="col-span-12 lg:col-span-3">
            <div className="space-y-4 sticky top-24">
              <ProfessionalProfileSidebar profile={userProfile} />
              
              {/* Quick Stats Card */}
              <Card className="bg-white border border-gray-200">
                <CardHeader className="pb-3">
                  <h4 className="font-semibold text-gray-900">Your Dashboard</h4>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-gray-600">Profile views</span>
                      </div>
                      <span className="text-sm font-semibold text-blue-600">+12%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-gray-600">Post impressions</span>
                      </div>
                      <span className="text-sm font-semibold text-green-600">+25%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-purple-600" />
                        <span className="text-sm text-gray-600">Search appearances</span>
                      </div>
                      <span className="text-sm font-semibold text-purple-600">+8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content - Feed */}
          <div className="col-span-12 lg:col-span-6">
            <div className="space-y-6">
              <CreatePostWidget />
              
              {/* Feed Filter */}
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                    <div className="flex space-x-2">
                      <Badge variant="secondary" className="cursor-pointer hover:bg-blue-100">
                        All
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                        Posts
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                        Articles
                      </Badge>
                    </div>
                  </div>
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

          {/* Right Sidebar - Suggestions & News */}
          <div className="col-span-12 lg:col-span-3">
            <div className="space-y-6 sticky top-24">
              <NetworkingSuggestions suggestions={networkingSuggestions} />
              
              {/* Industry News */}
              <Card className="bg-white border border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Industry News</h4>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      <h5 className="text-sm font-medium text-gray-900 mb-1">
                        RBI announces new digital lending guidelines
                      </h5>
                      <p className="text-xs text-gray-600">
                        New regulations aim to protect consumers and ensure fair practices
                      </p>
                      <span className="text-xs text-gray-500">2 hours ago • 1,234 readers</span>
                    </div>
                    
                    <div className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      <h5 className="text-sm font-medium text-gray-900 mb-1">
                        Fintech funding reaches $2.1B in Q4
                      </h5>
                      <p className="text-xs text-gray-600">
                        Record-breaking quarter shows continued investor confidence
                      </p>
                      <span className="text-xs text-gray-500">4 hours ago • 892 readers</span>
                    </div>
                    
                    <div className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      <h5 className="text-sm font-medium text-gray-900 mb-1">
                        ESG investments gain momentum
                      </h5>
                      <p className="text-xs text-gray-600">
                        Sustainable investing becomes mainstream choice for millennials
                      </p>
                      <span className="text-xs text-gray-500">6 hours ago • 2,156 readers</span>
                    </div>
                  </div>
                  
                  <Button variant="ghost" className="w-full mt-4 text-sm text-blue-600">
                    See all news
                  </Button>
                </CardContent>
              </Card>

              {/* Events */}
              <Card className="bg-white border border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold text-gray-900">Upcoming Events</h4>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="border-l-4 border-blue-500 pl-3">
                      <h5 className="text-sm font-medium text-gray-900">
                        FinTech India Summit 2024
                      </h5>
                      <p className="text-xs text-gray-600">Tomorrow, 10:00 AM</p>
                      <Badge variant="outline" className="mt-1 text-xs">Virtual</Badge>
                    </div>
                    
                    <div className="border-l-4 border-green-500 pl-3">
                      <h5 className="text-sm font-medium text-gray-900">
                        Investment Strategies Webinar
                      </h5>
                      <p className="text-xs text-gray-600">Jan 15, 3:00 PM</p>
                      <Badge variant="outline" className="mt-1 text-xs">Free</Badge>
                    </div>
                  </div>
                  
                  <Button variant="ghost" className="w-full mt-4 text-sm text-green-600">
                    Discover events
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
