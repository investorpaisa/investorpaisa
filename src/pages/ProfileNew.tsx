import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, Building, Calendar, Users, TrendingUp, Heart,
  MessageCircle, Share2, Bookmark, Eye, Award, Star,
  Plus, Edit3, Camera, Mail, Phone, Globe, Crown
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface UserProfile {
  id: string;
  full_name: string;
  username: string;
  avatar_url?: string;
  banner_image?: string;
  headline?: string;
  bio?: string;
  industry?: string;
  current_company?: string;
  followers: number;
  following: number;
  connection_count: number;
  is_verified: boolean;
  premium_member: boolean;
  experience_years: number;
  created_at: string;
}

interface Activity {
  id: string;
  activity_type: 'like' | 'comment' | 'repost' | 'post';
  target_type: 'post' | 'comment';
  target_id: string;
  created_at: string;
  post?: {
    id: string;
    title: string;
    content: string;
    author: {
      full_name: string;
      avatar_url?: string;
    };
  };
}

interface UserPost {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  likes: number;
  comment_count: number;
  created_at: string;
}

const ProfileNew = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    const profileId = userId || user?.id;
    if (profileId) {
      setIsOwnProfile(!userId || userId === user?.id);
      loadProfile(profileId);
      loadUserPosts(profileId);
      loadActivities(profileId);
      if (user?.id && userId && userId !== user.id) {
        checkFollowStatus(userId);
      }
    }
  }, [userId, user]);

  const loadProfile = async (profileId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error loading profile",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadActivities = async (profileId: string) => {
    try {
      // Load activities with proper joins
      const { data: activitiesData, error } = await supabase
        .from('user_activities')
        .select(`
          id, 
          activity_type, 
          target_type, 
          target_id,
          created_at
        `)
        .eq('user_id', profileId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // For each activity that targets a post, fetch the post details
      const activitiesWithPosts = await Promise.all(
        (activitiesData || []).map(async (activity) => {
          if (activity.target_type === 'post') {
            try {
              const { data: postData } = await supabase
                .from('posts')
                .select(`
                  id, title, content,
                  profiles:user_id (
                    full_name, avatar_url
                  )
                `)
                .eq('id', activity.target_id)
                .single();

              return {
                ...activity,
                post: postData ? {
                  id: postData.id,
                  title: postData.title,
                  content: postData.content,
                  author: postData.profiles
                } : undefined
              };
            } catch (postError) {
              console.error('Error loading post for activity:', postError);
              return activity;
            }
          }
          return activity;
        })
      );

      setActivities(activitiesWithPosts as Activity[]);
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  };

  const loadUserPosts = async (profileId: string) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, content, image_url, likes, comment_count, created_at')
        .eq('user_id', profileId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserPosts(data);
    } catch (error) {
      console.error('Error loading user posts:', error);
    }
  };

  const checkFollowStatus = async (targetUserId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .single();

      setIsFollowing(!!data);
    } catch (error) {
      // No existing follow relationship
      setIsFollowing(false);
    }
  };

  const toggleFollow = async () => {
    if (!user || !profile) return;

    try {
      if (isFollowing) {
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', profile.id);

        await Promise.all([
          supabase.rpc('decrement_followers', { user_id: profile.id }),
          supabase.rpc('decrement_following', { user_id: user.id })
        ]);
      } else {
        await supabase
          .from('follows')
          .insert({
            follower_id: user.id,
            following_id: profile.id
          });

        await Promise.all([
          supabase.rpc('increment_followers', { user_id: profile.id }),
          supabase.rpc('increment_following', { user_id: user.id })
        ]);
      }

      setIsFollowing(!isFollowing);
      setProfile(prev => prev ? {
        ...prev,
        followers: isFollowing ? prev.followers - 1 : prev.followers + 1
      } : null);
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast({
        title: "Error updating follow status",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart className="h-4 w-4 text-red-500" />;
      case 'comment': return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case 'repost': return <Share2 className="h-4 w-4 text-green-500" />;
      case 'post': return <Edit3 className="h-4 w-4 text-purple-500" />;
      default: return <TrendingUp className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.activity_type) {
      case 'like': return 'liked a post';
      case 'comment': return 'commented on a post';
      case 'repost': return 'shared a post';
      case 'post': return 'created a new post';
      default: return 'had activity';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <Card className="p-8 text-center rounded-3xl shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Profile not found</h2>
          <p className="text-slate-600">The profile you're looking for doesn't exist.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        
        {/* Modern Profile Header */}
        <Card className="overflow-hidden rounded-3xl shadow-lg border-0 bg-white/90 backdrop-blur-sm mb-6">
          {/* Banner with Gradient */}
          <div className="h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative">
            {profile.premium_member && (
              <div className="absolute top-6 right-6 flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                <Crown className="h-5 w-5 text-yellow-300" />
                <span className="text-white font-medium">Premium</span>
              </div>
            )}
            {isOwnProfile && (
              <Button 
                variant="secondary" 
                size="sm" 
                className="absolute top-6 left-6 rounded-2xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border-white/30"
              >
                <Camera className="h-4 w-4 mr-2" />
                Edit banner
              </Button>
            )}
          </div>

          <div className="px-8 pb-8">
            {/* Avatar and Basic Info */}
            <div className="flex items-end justify-between -mt-20 mb-6">
              <div className="relative">
                <Avatar className="h-40 w-40 ring-4 ring-white shadow-2xl">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-4xl font-bold">
                    {profile.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                {isOwnProfile && (
                  <Button 
                    size="sm" 
                    className="absolute -bottom-2 -right-2 rounded-full h-12 w-12 p-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                  >
                    <Camera className="h-5 w-5" />
                  </Button>
                )}
              </div>

              <div className="flex items-center space-x-3 mt-4">
                {!isOwnProfile && user && (
                  <>
                    <Button 
                      variant="outline" 
                      className="rounded-2xl border-slate-300 hover:bg-slate-50 px-6"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button 
                      onClick={toggleFollow}
                      className={`rounded-2xl px-6 ${
                        isFollowing 
                          ? 'bg-slate-600 hover:bg-slate-700 text-white' 
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                      }`}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                  </>
                )}
                {isOwnProfile && (
                  <Button variant="outline" className="rounded-2xl border-slate-300 hover:bg-slate-50 px-6">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit profile
                  </Button>
                )}
              </div>
            </div>

            {/* Profile Info with Modern Design */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <h1 className="text-4xl font-bold text-slate-900">{profile.full_name}</h1>
                  {profile.is_verified && (
                    <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-2xl px-3 py-1">
                      <Award className="h-4 w-4 mr-1" />
                      Verified Investor
                    </Badge>
                  )}
                  {profile.premium_member && (
                    <Badge className="bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 rounded-2xl px-3 py-1">
                      <Crown className="h-4 w-4 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
                <p className="text-xl text-slate-700 font-medium">{profile.headline}</p>
              </div>

              <div className="flex items-center space-x-8 text-sm text-slate-600">
                {profile.current_company && (
                  <div className="flex items-center space-x-2">
                    <Building className="h-5 w-5" />
                    <span>{profile.current_company}</span>
                  </div>
                )}
                {profile.industry && (
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>{profile.industry}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Joined {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}</span>
                </div>
              </div>

              {profile.bio && (
                <p className="text-slate-700 leading-relaxed text-lg">{profile.bio}</p>
              )}

              {/* Stats with Modern Cards */}
              <div className="grid grid-cols-4 gap-4 pt-6 border-t border-slate-100">
                {[
                  { label: 'Followers', value: profile.followers, color: 'from-blue-500 to-purple-500' },
                  { label: 'Following', value: profile.following, color: 'from-green-500 to-teal-500' },
                  { label: 'Connections', value: profile.connection_count, color: 'from-orange-500 to-red-500' },
                  { label: 'Posts', value: userPosts.length, color: 'from-pink-500 to-rose-500' }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className={`h-12 w-12 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-2`}>
                      <span className="text-2xl font-bold text-white">{stat.value}</span>
                    </div>
                    <div className="text-sm font-medium text-slate-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Modern Content Tabs */}
        <Card className="rounded-3xl shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b border-slate-100 rounded-none">
              {[
                { value: 'posts', label: `Posts (${userPosts.length})` },
                { value: 'activity', label: `Activity (${activities.length})` },
                { value: 'about', label: 'About' }
              ].map((tab) => (
                <TabsTrigger 
                  key={tab.value}
                  value={tab.value}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 px-8 py-4 font-medium"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Tab Contents with modern styling */}
            <TabsContent value="posts" className="p-8 space-y-6">
              {userPosts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="h-24 w-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Edit3 className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900 mb-3">
                    {isOwnProfile ? "You haven't posted anything yet" : `${profile.full_name} hasn't posted anything yet`}
                  </h3>
                  <p className="text-slate-600 text-lg">
                    {isOwnProfile ? "Share your investment insights with the community!" : "Check back later for new posts."}
                  </p>
                </div>
              ) : (
                userPosts.map((post) => (
                  <Card key={post.id} className="p-8 rounded-3xl border border-slate-100 hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-slate-900">{post.title}</h3>
                      <p className="text-slate-700 leading-relaxed line-clamp-3">{post.content}</p>
                      
                      {post.image_url && (
                        <div className="rounded-2xl overflow-hidden">
                          <img 
                            src={post.image_url} 
                            alt="Post content" 
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div className="flex items-center space-x-4 text-sm text-slate-600">
                          <span className="flex items-center space-x-1">
                            <Heart className="h-4 w-4" />
                            <span>{post.likes}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.comment_count}</span>
                          </span>
                        </div>
                        <span className="text-sm text-slate-500">
                          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="activity" className="p-6 space-y-4">
              {activities.length === 0 ? (
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No activity yet</h3>
                  <p className="text-slate-600">
                    {isOwnProfile ? "Start engaging with posts to see your activity here!" : "This user hasn't been active recently."}
                  </p>
                </div>
              ) : (
                activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-4 rounded-3xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.activity_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900">
                        <span className="font-medium">{profile.full_name}</span>
                        {' '}
                        <span className="text-slate-600">{getActivityText(activity)}</span>
                      </p>
                      {activity.post && (
                        <div className="mt-2 p-3 bg-white rounded-2xl border border-slate-200">
                          <h4 className="font-medium text-sm text-slate-900 mb-1">{activity.post.title}</h4>
                          <p className="text-sm text-slate-600 line-clamp-2">{activity.post.content}</p>
                          <p className="text-xs text-slate-500 mt-2">
                            by {activity.post.author.full_name}
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-slate-500 mt-2">
                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="about" className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">About</h3>
                  <p className="text-slate-700 leading-relaxed">
                    {profile.bio || "No bio available."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Professional Info</h4>
                    <div className="space-y-3">
                      {profile.current_company && (
                        <div className="flex items-center space-x-3">
                          <Building className="h-5 w-5 text-slate-500" />
                          <span className="text-slate-700">{profile.current_company}</span>
                        </div>
                      )}
                      {profile.industry && (
                        <div className="flex items-center space-x-3">
                          <TrendingUp className="h-5 w-5 text-slate-500" />
                          <span className="text-slate-700">{profile.industry}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-3">
                        <Award className="h-5 w-5 text-slate-500" />
                        <span className="text-slate-700">{profile.experience_years} years experience</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Account Info</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-slate-500" />
                        <span className="text-slate-700">
                          Joined {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      {profile.is_verified && (
                        <div className="flex items-center space-x-3">
                          <TrendingUp className="h-5 w-5 text-blue-500" />
                          <span className="text-slate-700">Verified Investor</span>
                        </div>
                      )}
                      {profile.premium_member && (
                        <div className="flex items-center space-x-3">
                          <Crown className="h-5 w-5 text-yellow-500" />
                          <span className="text-slate-700">Premium Member</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default ProfileNew;
