
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  TrendingUp, Users, Bell, Award, Crown, Sparkles,
  Image as ImageIcon, Video, FileText, Calendar, Plus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

interface ModernPost {
  id: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    title: string;
    company: string;
    verified: boolean;
    premium: boolean;
  };
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: number;
  reposts: number;
  isLiked: boolean;
  isSaved: boolean;
  isReposted: boolean;
  tags?: string[];
}

const ModernHome = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<ModernPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('for-you');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [createPostContent, setCreatePostContent] = useState('');

  // Mock data with modern finance focus
  const mockPosts: ModernPost[] = [
    {
      id: '1',
      author: {
        id: '1',
        name: 'Rajesh Kumar',
        username: 'rajesh_financial',
        avatar: '/placeholder.svg',
        title: 'Senior Financial Advisor',
        company: 'HDFC Bank',
        verified: true,
        premium: true
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

What's your take on the current market momentum? Are you positioning for a pullback or riding the wave?`,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      likes: 234,
      comments: 45,
      reposts: 12,
      isLiked: false,
      isSaved: false,
      isReposted: false,
      tags: ['MarketUpdate', 'Nifty50', 'InvestmentStrategy']
    },
    {
      id: '2',
      author: {
        id: '2',
        name: 'Priya Sharma',
        username: 'priya_wealth',
        avatar: '/placeholder.svg',
        title: 'Wealth Manager',
        company: 'Kotak Wealth',
        verified: false,
        premium: false
      },
      content: `💡 Tax Saving Season Alert! 

With just 2 months left in FY24, here's your quick checklist:

✅ Section 80C (₹1.5L limit)
• ELSS Mutual Funds
• PPF contributions  
• Life insurance premiums

✅ Section 80D (Medical Insurance)
• ₹25K for self & family
• Additional ₹50K for parents (60+)

✅ Section 80CCD(1B) - NPS
• Extra ₹50K deduction
• Great for retirement planning

Pro Tip: Don't invest just for tax saving! Choose instruments that align with your financial goals.

Need help with tax planning? DM me!`,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      likes: 156,
      comments: 28,
      reposts: 8,
      isLiked: true,
      isSaved: true,
      isReposted: false,
      tags: ['TaxPlanning', 'ELSS', 'FinancialPlanning']
    }
  ];

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPosts(mockPosts);
      setLoading(false);
    };

    loadPosts();
  }, []);

  const handleEngagement = async (postId: string, action: 'like' | 'save' | 'repost') => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          switch (action) {
            case 'like':
              return {
                ...post,
                isLiked: !post.isLiked,
                likes: post.isLiked ? post.likes - 1 : post.likes + 1
              };
            case 'save':
              return { ...post, isSaved: !post.isSaved };
            case 'repost':
              return {
                ...post,
                isReposted: !post.isReposted,
                reposts: post.isReposted ? post.reposts - 1 : post.reposts + 1
              };
            default:
              return post;
          }
        }
        return post;
      })
    );

    // Record interaction in user activities
    if (user) {
      try {
        await supabase.from('user_activities').insert({
          user_id: user.id,
          activity_type: action,
          target_type: 'post',
          target_id: postId
        });
      } catch (error) {
        console.error('Error recording activity:', error);
      }
    }

    toast({
      title: `Post ${action}d successfully!`,
      description: `The post has been ${action}d.`
    });
  };

  const handleCreatePost = async () => {
    if (!createPostContent.trim() || !user) return;

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          title: createPostContent.substring(0, 100),
          content: createPostContent,
          visibility: 'public'
        })
        .select()
        .single();

      if (error) throw error;

      // Record post creation activity
      await supabase.from('user_activities').insert({
        user_id: user.id,
        activity_type: 'post',
        target_type: 'post',
        target_id: data.id
      });

      setCreatePostContent('');
      setShowCreatePost(false);
      toast({
        title: "Post created successfully!",
        description: "Your post has been shared with your network."
      });

      // Refresh posts
      // In real app, you'd add the new post to the feed
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error creating post",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="rounded-3xl border-0 shadow-sm bg-white/80 backdrop-blur-sm animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="h-12 w-12 bg-slate-200 rounded-3xl"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-200 rounded-2xl w-1/3"></div>
                      <div className="h-3 bg-slate-200 rounded-2xl w-1/4"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-200 rounded-2xl"></div>
                    <div className="h-4 bg-slate-200 rounded-2xl w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        
        {/* Modern Create Post Widget */}
        <Card className="mb-6 rounded-3xl border-0 shadow-sm bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12 ring-2 ring-blue-100">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold">
                  {user?.user_metadata?.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <Button
                variant="ghost"
                onClick={() => setShowCreatePost(true)}
                className="flex-1 justify-start h-12 bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200/50 rounded-3xl text-slate-600 font-normal"
              >
                Share your investment insights...
              </Button>
            </div>

            {showCreatePost && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 space-y-4"
              >
                <textarea
                  value={createPostContent}
                  onChange={(e) => setCreatePostContent(e.target.value)}
                  placeholder="What's happening in the markets? Share your insights..."
                  className="w-full min-h-32 p-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none bg-white/80 backdrop-blur-sm"
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button variant="ghost" size="sm" className="rounded-2xl text-slate-600">
                      <ImageIcon className="h-5 w-5 mr-2" />
                      Photo
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-2xl text-slate-600">
                      <Video className="h-5 w-5 mr-2" />
                      Video
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-2xl text-slate-600">
                      <FileText className="h-5 w-5 mr-2" />
                      Document
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      onClick={() => setShowCreatePost(false)}
                      className="rounded-2xl"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreatePost}
                      disabled={!createPostContent.trim()}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl px-6"
                    >
                      Post
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Feed Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="w-full bg-white/80 backdrop-blur-sm rounded-3xl p-1 shadow-sm border-0">
            <TabsTrigger 
              value="for-you"
              className="flex-1 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white font-medium"
            >
              For You
            </TabsTrigger>
            <TabsTrigger 
              value="following"
              className="flex-1 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white font-medium"
            >
              Following
            </TabsTrigger>
            <TabsTrigger 
              value="trending"
              className="flex-1 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white font-medium"
            >
              Trending
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-6">
              <AnimatePresence>
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="rounded-3xl border-0 shadow-sm bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-12 w-12 ring-2 ring-slate-100">
                              <AvatarImage src={post.author.avatar} />
                              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold">
                                {post.author.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-slate-900">{post.author.name}</h3>
                                {post.author.verified && (
                                  <Badge className="bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs">
                                    <Award className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                                {post.author.premium && (
                                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full px-2 py-1 text-xs">
                                    <Crown className="h-3 w-3 mr-1" />
                                    Premium
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-slate-600">
                                {post.author.title} at {post.author.company}
                              </p>
                              <p className="text-xs text-slate-500">
                                {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                          
                          <Button variant="ghost" size="sm" className="rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          <p className="text-slate-800 leading-relaxed whitespace-pre-line">
                            {post.content}
                          </p>
                          
                          {post.image && (
                            <div className="rounded-2xl overflow-hidden">
                              <img 
                                src={post.image} 
                                alt="Post content" 
                                className="w-full h-auto object-cover"
                              />
                            </div>
                          )}
                          
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {post.tags.map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer text-xs"
                                >
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          {/* Engagement Actions - Modern Style */}
                          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                            <div className="flex items-center space-x-6">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEngagement(post.id, 'like')}
                                className={`flex items-center space-x-2 rounded-2xl px-4 py-2 transition-all duration-200 ${
                                  post.isLiked 
                                    ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                                    : 'text-slate-600 hover:text-red-600 hover:bg-red-50'
                                }`}
                              >
                                <Heart className={`h-5 w-5 ${post.isLiked ? 'fill-current' : ''}`} />
                                <span className="font-medium">{post.likes}</span>
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-2xl px-4 py-2 transition-all duration-200"
                              >
                                <MessageCircle className="h-5 w-5" />
                                <span className="font-medium">{post.comments}</span>
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEngagement(post.id, 'repost')}
                                className={`flex items-center space-x-2 rounded-2xl px-4 py-2 transition-all duration-200 ${
                                  post.isReposted 
                                    ? 'text-green-600 bg-green-50 hover:bg-green-100' 
                                    : 'text-slate-600 hover:text-green-600 hover:bg-green-50'
                                }`}
                              >
                                <Share2 className="h-5 w-5" />
                                <span className="font-medium">{post.reposts}</span>
                              </Button>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEngagement(post.id, 'save')}
                              className={`rounded-2xl p-2 transition-all duration-200 ${
                                post.isSaved 
                                  ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
                                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                              }`}
                            >
                              <Bookmark className={`h-5 w-5 ${post.isSaved ? 'fill-current' : ''}`} />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ModernHome;
