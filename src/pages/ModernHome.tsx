
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Heart, MessageCircle, Share, Bookmark, MoreHorizontal,
  TrendingUp, Users, Award, Calendar, MapPin, Building,
  Image as ImageIcon, Video, Link as LinkIcon, Smile,
  PlusCircle, Bell, BookOpen, Target, BarChart3,
  Sparkles, Brain, Zap, Star, Flame
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Post {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  likes: number;
  comment_count: number;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string;
    username: string;
    avatar_url: string;
    headline: string;
    is_verified: boolean;
  };
}

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  published_at: string;
  thumbnail_url?: string;
}

const ModernHome = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postTitle, setPostTitle] = useState('');

  useEffect(() => {
    loadFeedData();
  }, []);

  const loadFeedData = async () => {
    try {
      setLoading(true);

      // Load posts with user profiles
      const { data: postsData } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!posts_user_id_fkey(
            full_name,
            username,
            avatar_url,
            headline,
            is_verified
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (postsData) {
        setPosts(postsData);
      }

      // Load financial news
      const { data: newsData } = await supabase
        .from('news_articles')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(10);

      if (newsData) {
        setNews(newsData);
      }

    } catch (error) {
      console.error('Error loading feed:', error);
      toast.error('Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!postTitle.trim() || !postContent.trim() || !user) return;

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          title: postTitle,
          content: postContent,
          visibility: 'public'
        })
        .select(`
          *,
          profiles!posts_user_id_fkey(
            full_name,
            username,
            avatar_url,
            headline,
            is_verified
          )
        `)
        .single();

      if (error) throw error;

      // Add to user activities
      await supabase.from('user_activities').insert({
        user_id: user.id,
        activity_type: 'post',
        target_type: 'post',
        target_id: data.id
      });

      setPosts([data, ...posts]);
      setPostTitle('');
      setPostContent('');
      setShowCreatePost(false);
      toast.success('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) return;

    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Unlike
        await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        await supabase.rpc('decrement_likes', { post_id: postId });
      } else {
        // Like
        await supabase
          .from('likes')
          .insert({
            post_id: postId,
            user_id: user.id
          });

        await supabase.rpc('increment_likes', { post_id: postId });

        // Add to activities
        await supabase.from('user_activities').insert({
          user_id: user.id,
          activity_type: 'like',
          target_type: 'post',
          target_id: postId
        });
      }

      loadFeedData();
    } catch (error) {
      console.error('Error handling like:', error);
      toast.error('Failed to update like');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-slate-600">Loading your feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Sidebar - Profile Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="rounded-3xl border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Avatar className="h-20 w-20 mx-auto mb-4 ring-2 ring-blue-100">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white font-bold text-lg">
                    {user?.user_metadata?.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-slate-900 mb-1">{user?.user_metadata?.full_name || 'User'}</h3>
                <p className="text-slate-600 text-sm mb-4">Financial Professional</p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="font-bold text-lg text-slate-900">127</div>
                    <div className="text-xs text-slate-600">Connections</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg text-slate-900">2.4K</div>
                    <div className="text-xs text-slate-600">Followers</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="rounded-3xl border-0 shadow-lg bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white">
              <CardContent className="p-6">
                <h3 className="font-bold mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Portfolio Snapshot
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-blue-100">Total Value</span>
                    <span className="font-bold">₹12.5L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-100">Today's P&L</span>
                    <span className="font-bold text-green-300">+₹2,450</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-100">Overall Return</span>
                    <span className="font-bold text-green-300">+18.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Column - Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post Card */}
            <Card className="rounded-3xl border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12 ring-2 ring-blue-100">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white font-bold">
                      {user?.user_metadata?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreatePost(true)}
                    className="flex-1 justify-start text-slate-500 hover:text-slate-700 rounded-3xl border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                  >
                    Share your financial insights...
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <Button variant="ghost" size="sm" className="rounded-2xl text-blue-600 hover:bg-blue-50">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Photo
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-2xl text-green-600 hover:bg-green-50">
                    <Video className="h-4 w-4 mr-2" />
                    Video
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-2xl text-purple-600 hover:bg-purple-50">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Article
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-2xl text-orange-600 hover:bg-orange-50">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Poll
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Feed Posts */}
            <div className="space-y-6">
              {posts.map((post) => (
                <Card key={post.id} className="rounded-3xl border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    {/* Post Header */}
                    <div className="flex items-start space-x-4 mb-4">
                      <Avatar className="h-12 w-12 ring-2 ring-blue-100">
                        <AvatarImage src={post.profiles?.avatar_url} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white font-bold">
                          {post.profiles?.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-slate-900">{post.profiles?.full_name}</h3>
                          {post.profiles?.is_verified && (
                            <Badge className="bg-blue-100 text-blue-800 text-xs rounded-full">Verified</Badge>
                          )}
                        </div>
                        <p className="text-slate-600 text-sm">{post.profiles?.headline}</p>
                        <p className="text-slate-500 text-xs">{new Date(post.created_at).toLocaleDateString()}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="rounded-2xl">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Post Content */}
                    <div className="mb-4">
                      <h2 className="font-bold text-slate-900 text-lg mb-2">{post.title}</h2>
                      <p className="text-slate-700 leading-relaxed">{post.content}</p>
                      {post.image_url && (
                        <img 
                          src={post.image_url} 
                          alt="Post image" 
                          className="w-full rounded-2xl mt-4"
                        />
                      )}
                    </div>

                    {/* Post Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post.id)}
                        className="rounded-2xl hover:bg-red-50 hover:text-red-600"
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="rounded-2xl hover:bg-blue-50 hover:text-blue-600">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        {post.comment_count}
                      </Button>
                      <Button variant="ghost" size="sm" className="rounded-2xl hover:bg-green-50 hover:text-green-600">
                        <Share className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="ghost" size="sm" className="rounded-2xl hover:bg-yellow-50 hover:text-yellow-600">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Sidebar - Features & News */}
          <div className="lg:col-span-1 space-y-6">
            {/* AI Features */}
            <Card className="rounded-3xl border-0 shadow-lg bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white">
              <CardHeader>
                <h3 className="font-bold flex items-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  AI Features
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/20 rounded-2xl">
                  <Brain className="h-4 w-4 mr-2" />
                  Portfolio Analysis
                </Button>
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/20 rounded-2xl">
                  <Zap className="h-4 w-4 mr-2" />
                  Smart Insights
                </Button>
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/20 rounded-2xl">
                  <Target className="h-4 w-4 mr-2" />
                  Goal Tracker
                </Button>
              </CardContent>
            </Card>

            {/* Financial Learning */}
            <Card className="rounded-3xl border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <h3 className="font-bold text-slate-900 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-green-600" />
                  Fin Learning
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-green-50 rounded-2xl">
                  <h4 className="font-medium text-green-900 text-sm">Options Trading Basics</h4>
                  <p className="text-green-700 text-xs">5 min read</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-2xl">
                  <h4 className="font-medium text-blue-900 text-sm">SIP vs Lump Sum</h4>
                  <p className="text-blue-700 text-xs">3 min read</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-2xl">
                  <h4 className="font-medium text-purple-900 text-sm">Tax Saving Guide</h4>
                  <p className="text-purple-700 text-xs">7 min read</p>
                </div>
              </CardContent>
            </Card>

            {/* Trending News */}
            <Card className="rounded-3xl border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <h3 className="font-bold text-slate-900 flex items-center">
                  <Flame className="h-5 w-5 mr-2 text-orange-600" />
                  Trending News
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {news.slice(0, 5).map((article) => (
                  <div key={article.id} className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer">
                    <h4 className="font-medium text-slate-900 text-sm line-clamp-2 mb-1">{article.title}</h4>
                    <div className="flex items-center justify-between">
                      <p className="text-slate-600 text-xs">{article.source}</p>
                      <p className="text-slate-500 text-xs">{new Date(article.published_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Market Widgets */}
            <Card className="rounded-3xl border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <h3 className="font-bold text-slate-900 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Market Overview
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">NIFTY 50</span>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">21,456.30</div>
                    <div className="text-green-600 text-sm">+1.2%</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">SENSEX</span>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">70,823.15</div>
                    <div className="text-green-600 text-sm">+0.8%</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">USD/INR</span>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">83.24</div>
                    <div className="text-red-600 text-sm">-0.1%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
        <DialogContent className="sm:max-w-2xl rounded-3xl border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center">
              <PlusCircle className="h-6 w-6 mr-3 text-blue-600" />
              Create Post
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12 ring-2 ring-blue-100">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white font-bold">
                  {user?.user_metadata?.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-slate-900">{user?.user_metadata?.full_name || 'User'}</p>
                <p className="text-sm text-slate-600">Sharing with your network</p>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="Give your post a compelling title..."
                className="rounded-2xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
              />
              
              <Textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="What's happening in the markets? Share your insights..."
                className="min-h-32 rounded-2xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 resize-none"
              />
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" className="rounded-2xl text-slate-600 hover:bg-slate-100">
                  <ImageIcon className="h-5 w-5 mr-2" />
                  Photo
                </Button>
                <Button variant="ghost" size="sm" className="rounded-2xl text-slate-600 hover:bg-slate-100">
                  <Video className="h-5 w-5 mr-2" />
                  Video
                </Button>
                <Button variant="ghost" size="sm" className="rounded-2xl text-slate-600 hover:bg-slate-100">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Chart
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
                  disabled={!postTitle.trim() || !postContent.trim()}
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 rounded-2xl px-6"
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModernHome;
