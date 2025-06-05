
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Edit3,
  Heart,
  MessageCircle,
  Share2,
  Crown,
  Calendar,
  MapPin,
  Link as LinkIcon,
  TrendingUp,
  Award,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Reactions } from '@/components/ui/reactions';

interface UserPost {
  id: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  reactions: Record<string, number>;
  userReaction?: string;
}

interface UserReaction {
  id: string;
  type: string;
  content: {
    id: string;
    title: string;
    author: string;
  };
  timestamp: string;
}

const UserProfile: React.FC = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('posts');

  // Mock data - replace with actual data fetching
  const userPosts: UserPost[] = [
    {
      id: '1',
      content: 'Just analyzed the latest market trends. The tech sector is showing promising growth patterns! 📈',
      timestamp: '2 hours ago',
      likes: 24,
      comments: 8,
      shares: 3,
      reactions: { like: 15, love: 6, wow: 3 },
      userReaction: 'like'
    },
    {
      id: '2',
      content: 'Warren Buffett\'s investment philosophy continues to be relevant in today\'s market. Long-term thinking is key! 💡',
      timestamp: '1 day ago',
      likes: 45,
      comments: 12,
      shares: 8,
      reactions: { like: 30, love: 10, wow: 5 }
    }
  ];

  const userReactions: UserReaction[] = [
    {
      id: '1',
      type: 'love',
      content: {
        id: 'post-123',
        title: 'Market Analysis: Q4 Performance',
        author: 'John Doe'
      },
      timestamp: '3 hours ago'
    },
    {
      id: '2',
      type: 'like',
      content: {
        id: 'news-456',
        title: 'Federal Reserve Updates Interest Rates',
        author: 'Financial Times'
      },
      timestamp: '5 hours ago'
    }
  ];

  const handleReaction = (postId: string, reactionId: string) => {
    console.log('Reaction:', reactionId, 'on post:', postId);
    // Implement reaction logic here
  };

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

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Profile Header */}
        <Card className="bg-gray-900/50 border-white/10">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || 'User'}
                    className="w-24 h-24 rounded-full object-cover border-2 border-gold/30"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold to-gold/80 flex items-center justify-center">
                    <User className="w-12 h-12 text-black" />
                  </div>
                )}
                {profile?.is_verified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gold rounded-full flex items-center justify-center">
                    <Crown className="w-4 h-4 text-black" />
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-white">
                    {profile?.full_name || profile?.username || 'User'}
                  </h1>
                  <Badge className={getRoleColor(profile?.role || 'user')}>
                    {profile?.role?.charAt(0).toUpperCase() + profile?.role?.slice(1)}
                  </Badge>
                </div>
                
                <p className="text-white/70 mb-4">
                  @{profile?.username || 'username'}
                </p>

                {profile?.bio && (
                  <p className="text-white/80 mb-4">{profile.bio}</p>
                )}

                <div className="flex items-center gap-6 text-sm text-white/60 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(profile?.created_at || '').getFullYear()}</span>
                  </div>
                  {profile?.financial_literacy_score && (
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      <span>Score: {profile.financial_literacy_score}/100</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <span className="text-white">
                    <strong>{profile?.following || 0}</strong>{' '}
                    <span className="text-white/60">Following</span>
                  </span>
                  <span className="text-white">
                    <strong>{profile?.followers || 0}</strong>{' '}
                    <span className="text-white/60">Followers</span>
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="border-gold/30 text-gold hover:bg-gold hover:text-black"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  className="border-white/20 text-white/70 hover:bg-white/5"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-gray-900/50 border border-white/10">
            <TabsTrigger 
              value="posts" 
              className="data-[state=active]:bg-gold data-[state=active]:text-black"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger 
              value="reactions" 
              className="data-[state=active]:bg-gold data-[state=active]:text-black"
            >
              Reactions
            </TabsTrigger>
            <TabsTrigger 
              value="onboarding" 
              className="data-[state=active]:bg-gold data-[state=active]:text-black"
            >
              Profile Data
            </TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <TabsContent value="posts" className="space-y-4">
            {userPosts.map((post) => (
              <Card key={post.id} className="bg-gray-900/50 border-white/10">
                <CardContent className="p-6">
                  <p className="text-white mb-4">{post.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">{post.timestamp}</span>
                    <div className="flex items-center space-x-4">
                      <Reactions
                        contentId={post.id}
                        onReaction={(reactionId) => handleReaction(post.id, reactionId)}
                        userReaction={post.userReaction}
                        reactionCounts={post.reactions}
                        compact
                      />
                      <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {post.comments}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                        <Share2 className="w-4 h-4 mr-1" />
                        {post.shares}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Reactions Tab */}
          <TabsContent value="reactions" className="space-y-4">
            {userReactions.map((reaction) => (
              <Card key={reaction.id} className="bg-gray-900/50 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">
                      {reaction.type === 'like' && '👍'}
                      {reaction.type === 'love' && '❤️'}
                      {reaction.type === 'wow' && '😮'}
                    </span>
                    <div className="flex-1">
                      <p className="text-white">
                        You reacted to "{reaction.content.title}"
                      </p>
                      <p className="text-sm text-white/60">
                        by {reaction.content.author} • {reaction.timestamp}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Onboarding/Profile Data Tab */}
          <TabsContent value="onboarding" className="space-y-4">
            <Card className="bg-gray-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Financial Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h4 className="font-medium text-white mb-2">Primary Goal</h4>
                    <p className="text-sm text-white/60 capitalize">
                      {typeof profile?.financial_goals === 'object' && profile?.financial_goals
                        ? (profile.financial_goals as any).primary_goal?.replace('_', ' ') || 'Not set'
                        : 'Not set'}
                    </p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h4 className="font-medium text-white mb-2">Risk Profile</h4>
                    <p className="text-sm text-white/60 capitalize">
                      {profile?.risk_profile?.replace('_', ' ') || 'Not set'}
                    </p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h4 className="font-medium text-white mb-2">Financial Literacy</h4>
                    <p className="text-sm text-white/60">
                      {profile?.financial_literacy_score ? `${profile.financial_literacy_score}/100` : 'Not assessed'}
                    </p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h4 className="font-medium text-white mb-2">Onboarding Status</h4>
                    <p className="text-sm text-white/60">
                      {profile?.onboarding_completed ? 'Completed' : 'Pending'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="border-gold/30 text-gold hover:bg-gold hover:text-black"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Update Profile Data
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default UserProfile;
