
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  PlusCircle, Image, Video, FileText, Calendar,
  Heart, MessageCircle, Share2, Bookmark, Send,
  TrendingUp, Users, Building, MapPin, MoreHorizontal
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface Post {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  hashtags?: string[];
  likes: number;
  comment_count: number;
  created_at: string;
  is_liked: boolean;
  is_bookmarked: boolean;
  author: {
    id: string;
    full_name: string;
    username: string;
    avatar_url?: string;
    headline?: string;
    industry?: string;
    is_verified: boolean;
    premium_member: boolean;
  };
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  likes: number;
  author: {
    id: string;
    full_name: string;
    avatar_url?: string;
    headline?: string;
  };
}

const ProfessionalHome = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [isPosting, setIsPosting] = useState(false);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id, title, content, image_url, hashtags, likes, comment_count, created_at,
          profiles:user_id (
            id, full_name, username, avatar_url, headline, industry, is_verified, premium_member
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Check which posts are liked and bookmarked by current user
      const postsWithInteractions = await Promise.all(
        data.map(async (post) => {
          const [likesData, bookmarksData] = await Promise.all([
            user ? supabase
              .from('likes')
              .select('id')
              .eq('post_id', post.id)
              .eq('user_id', user.id)
              .single() : Promise.resolve({ data: null }),
            user ? supabase
              .from('bookmarks')
              .select('id')
              .eq('post_id', post.id)
              .eq('user_id', user.id)
              .single() : Promise.resolve({ data: null })
          ]);

          return {
            ...post,
            is_liked: !!likesData.data,
            is_bookmarked: !!bookmarksData.data,
            author: post.profiles
          };
        })
      );

      setPosts(postsWithInteractions);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast({
        title: "Error loading posts",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createPost = async () => {
    if (!user || !newPost.title.trim() || !newPost.content.trim()) return;

    setIsPosting(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          title: newPost.title,
          content: newPost.content,
          user_id: user.id,
          likes: 0,
          comment_count: 0
        })
        .select()
        .single();

      if (error) throw error;

      // Track user activity
      await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: 'post',
          target_id: data.id,
          target_type: 'post'
        });

      setNewPost({ title: '', content: '' });
      loadPosts();
      
      toast({
        title: "Post created successfully!",
        description: "Your investment insight has been shared with the community."
      });
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error creating post",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsPosting(false);
    }
  };

  const toggleLike = async (postId: string, currentlyLiked: boolean) => {
    if (!user) return;

    try {
      if (currentlyLiked) {
        await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
        
        await supabase.rpc('decrement_likes', { post_id: postId });
      } else {
        await supabase
          .from('likes')
          .insert({
            post_id: postId,
            user_id: user.id
          });
        
        await supabase.rpc('increment_likes', { post_id: postId });

        // Track user activity
        await supabase
          .from('user_activities')
          .insert({
            user_id: user.id,
            activity_type: 'like',
            target_id: postId,
            target_type: 'post'
          });
      }

      // Update local state
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              is_liked: !currentlyLiked,
              likes: currentlyLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error updating like",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const toggleBookmark = async (postId: string, currentlyBookmarked: boolean) => {
    if (!user) return;

    try {
      if (currentlyBookmarked) {
        await supabase
          .from('bookmarks')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('bookmarks')
          .insert({
            post_id: postId,
            user_id: user.id
          });
      }

      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, is_bookmarked: !currentlyBookmarked }
          : post
      ));
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast({
        title: "Error updating bookmark",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const loadComments = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          id, content, created_at, likes,
          profiles:user_id (
            id, full_name, avatar_url, headline
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setComments(data.map(comment => ({
        ...comment,
        author: comment.profiles
      })));
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const addComment = async (postId: string) => {
    if (!user || !newComment.trim()) return;

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          content: newComment,
          post_id: postId,
          user_id: user.id,
          likes: 0
        })
        .select()
        .single();

      if (error) throw error;

      await supabase.rpc('increment_comments', { post_id: postId });

      // Track user activity
      await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: 'comment',
          target_id: postId,
          target_type: 'post'
        });

      setNewComment('');
      loadComments(postId);
      
      // Update post comment count
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, comment_count: post.comment_count + 1 }
          : post
      ));
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error adding comment",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const handleShare = async (postId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('reposts')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: '' // Empty for simple repost
        });

      await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: 'repost',
          target_id: postId,
          target_type: 'post'
        });

      toast({
        title: "Post shared!",
        description: "The investment insight has been shared to your network."
      });
    } catch (error) {
      console.error('Error sharing post:', error);
      toast({
        title: "Error sharing post",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Create Post Card */}
        <Card className="p-6 shadow-sm border border-slate-200 rounded-2xl bg-white/80 backdrop-blur-sm">
          <div className="flex items-start space-x-4">
            <Avatar className="h-12 w-12 ring-2 ring-blue-100">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-blue-600 text-white font-semibold">
                {user?.user_metadata?.full_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <Input
                placeholder="Share your investment insights..."
                value={newPost.title}
                onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                className="border-0 bg-slate-50 rounded-xl text-lg font-medium placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-500"
              />
              <Textarea
                placeholder="What's happening in the markets? Share your analysis, tips, or insights..."
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                className="border-0 bg-slate-50 rounded-xl min-h-[100px] placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-500 resize-none"
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl">
                    <Image className="h-5 w-5 mr-2" />
                    Photo
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl">
                    <Video className="h-5 w-5 mr-2" />
                    Video
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl">
                    <FileText className="h-5 w-5 mr-2" />
                    Document
                  </Button>
                </div>
                <Button 
                  onClick={createPost}
                  disabled={isPosting || !newPost.title.trim() || !newPost.content.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6"
                >
                  {isPosting ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id} className="shadow-sm border border-slate-200 rounded-2xl bg-white/80 backdrop-blur-sm overflow-hidden">
              
              {/* Post Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 ring-2 ring-transparent hover:ring-blue-200 transition-all cursor-pointer">
                      <AvatarImage src={post.author.avatar_url} />
                      <AvatarFallback className="bg-blue-600 text-white font-semibold">
                        {post.author.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors">
                          {post.author.full_name}
                        </h3>
                        {post.author.is_verified && (
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                        )}
                        {post.author.premium_member && (
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs rounded-lg">
                            Premium
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600">{post.author.headline}</p>
                      <p className="text-xs text-slate-500">
                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-700 rounded-xl">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Post Content */}
              <div className="px-6 pb-4">
                <h2 className="text-lg font-semibold text-slate-900 mb-3">{post.title}</h2>
                <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </div>
                
                {post.image_url && (
                  <div className="mt-4 rounded-xl overflow-hidden">
                    <img 
                      src={post.image_url} 
                      alt="Post content" 
                      className="w-full h-auto max-h-96 object-cover"
                    />
                  </div>
                )}
                
                {post.hashtags && post.hashtags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.hashtags.map((tag, index) => (
                      <span 
                        key={index}
                        className="text-blue-600 hover:text-blue-700 cursor-pointer text-sm font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Engagement Stats */}
              <div className="px-6 py-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <div className="flex items-center space-x-4">
                    {post.likes > 0 && (
                      <span className="flex items-center space-x-1">
                        <Heart className="h-4 w-4 text-red-500 fill-current" />
                        <span>{post.likes}</span>
                      </span>
                    )}
                    {post.comment_count > 0 && (
                      <span>{post.comment_count} comments</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center space-x-2 transition-colors rounded-xl ${
                      post.is_liked 
                        ? 'text-red-600 hover:text-red-700 hover:bg-red-50' 
                        : 'text-slate-600 hover:text-red-600 hover:bg-red-50'
                    }`}
                    onClick={() => toggleLike(post.id, post.is_liked)}
                  >
                    <Heart className={`h-5 w-5 ${post.is_liked ? 'fill-current' : ''}`} />
                    <span className="font-medium">Like</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-xl"
                    onClick={() => {
                      setShowComments(showComments === post.id ? null : post.id);
                      if (showComments !== post.id) {
                        loadComments(post.id);
                      }
                    }}
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span className="font-medium">Comment</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2 text-slate-600 hover:text-green-600 hover:bg-green-50 transition-colors rounded-xl"
                    onClick={() => handleShare(post.id)}
                  >
                    <Share2 className="h-5 w-5" />
                    <span className="font-medium">Share</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center space-x-2 transition-colors rounded-xl ${
                      post.is_bookmarked 
                        ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50' 
                        : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                    onClick={() => toggleBookmark(post.id, post.is_bookmarked)}
                  >
                    <Bookmark className={`h-5 w-5 ${post.is_bookmarked ? 'fill-current' : ''}`} />
                    <span className="font-medium">Save</span>
                  </Button>
                </div>
              </div>

              {/* Comments Section */}
              {showComments === post.id && (
                <div className="border-t border-slate-100 bg-slate-50/50">
                  <div className="p-6 space-y-4">
                    {/* Add Comment */}
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-blue-600 text-white text-sm">
                          {user?.user_metadata?.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 flex items-center space-x-2">
                        <Input
                          placeholder="Add a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="flex-1 rounded-full border-slate-200 bg-white"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              addComment(post.id);
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          onClick={() => addComment(post.id)}
                          disabled={!newComment.trim()}
                          className="rounded-full bg-blue-600 hover:bg-blue-700"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div key={comment.id} className="flex items-start space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.author.avatar_url} />
                            <AvatarFallback className="bg-slate-600 text-white text-sm">
                              {comment.author.full_name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-slate-100">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-semibold text-sm text-slate-900">
                                  {comment.author.full_name}
                                </span>
                                <span className="text-xs text-slate-500">
                                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                </span>
                              </div>
                              <p className="text-sm text-slate-700">{comment.content}</p>
                            </div>
                            <div className="flex items-center space-x-4 mt-2 ml-4">
                              <Button variant="ghost" size="sm" className="text-xs text-slate-500 hover:text-blue-600 h-auto p-1 rounded-lg">
                                Like
                              </Button>
                              <Button variant="ghost" size="sm" className="text-xs text-slate-500 hover:text-blue-600 h-auto p-1 rounded-lg">
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalHome;
