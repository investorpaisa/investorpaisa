
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageSquare, Share2, Bookmark, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { useCommentsDialog } from '@/hooks/useCommentsDialog';
import { toast } from 'sonner';
import { RepostDialog } from '@/components/engagement/RepostDialog';

interface Post {
  id: number;
  author: {
    name: string;
    username: string;
    avatar: string;
    role: string;
    verified: boolean;
  };
  category: string;
  title: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  saved: boolean;
}

interface PostFeedProps {
  feedPosts: Post[];
}

const PostFeed = ({ feedPosts }: PostFeedProps) => {
  const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>({});
  const [savedPosts, setSavedPosts] = useState<Record<number, boolean>>({
    2: true, // Initialize post 2 as saved
  });
  const [refreshing, setRefreshing] = useState(false);
  const [repostDialogOpen, setRepostDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const { openComments } = useCommentsDialog();

  const handleLike = (postId: number) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleSave = (postId: number) => {
    setSavedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleComment = (post: Post) => {
    openComments({
      id: post.id.toString(),
      title: post.title,
      content: post.content,
      entityType: 'post',
      commentsCount: post.comments,
      onCommentAdded: () => console.log('Comment added to post', post.id)
    });
  };

  const handleRepost = (post: Post) => {
    setSelectedPost(post);
    setRepostDialogOpen(true);
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    
    // Simulate a network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Feed refreshed');
    setRefreshing(false);
  }, []);

  const renderPostCard = (post: Post) => (
    <Card key={post.id} className="border shadow-sm animate-hover-rise">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar 
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}{post.author.name.split(' ')[1]?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1">
                <h4 
                  className="font-medium hover:underline cursor-pointer"
                >
                  {post.author.name}
                </h4>
                {post.author.verified && (
                  <span className="text-ip-teal">
                    <TrendingUp className="h-3 w-3" />
                  </span>
                )}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span className="mr-2">@{post.author.username}</span>
                <span className="mr-2">•</span>
                <span>{post.timestamp}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <Badge variant="outline" className="bg-ip-blue-50 text-ip-blue-800 mr-2 hover:bg-ip-blue-100 transition-colors">
              {post.category}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Report content</DropdownMenuItem>
                <DropdownMenuItem>Hide posts from this user</DropdownMenuItem>
                <DropdownMenuItem>Copy link</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <h3 className="text-lg font-medium mb-2">{post.title}</h3>
        <p className="text-muted-foreground text-sm">{post.content}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`gap-1 ${likedPosts[post.id] ? 'text-ip-teal' : ''}`}
            onClick={() => handleLike(post.id)}
          >
            <Heart className="h-4 w-4" fill={likedPosts[post.id] ? "currentColor" : "none"} />
            <span>{post.likes + (likedPosts[post.id] ? 1 : 0)}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1" onClick={() => handleComment(post)}>
            <MessageSquare className="h-4 w-4" />
            <span>{post.comments}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1" onClick={() => handleRepost(post)}>
            <Share2 className="h-4 w-4" />
            <span>{post.shares}</span>
          </Button>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className={savedPosts[post.id] ? 'text-ip-teal' : ''}
          onClick={() => handleSave(post.id)}
        >
          <Bookmark className="h-4 w-4" fill={savedPosts[post.id] ? "currentColor" : "none"} />
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-6">
      {refreshing && (
        <div className="flex justify-center py-2">
          <RefreshCw className="h-6 w-6 animate-spin text-ip-teal" />
        </div>
      )}
      
      <div className="space-y-6">
        {feedPosts.map(renderPostCard)}
      </div>
      
      {feedPosts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10">
          <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No posts yet</h3>
          <p className="text-muted-foreground text-center mb-4">Follow more users and experts to see their posts here</p>
          <Button>Discover People to Follow</Button>
        </div>
      )}
      
      {/* Repost Dialog */}
      {selectedPost && (
        <RepostDialog 
          open={repostDialogOpen} 
          onOpenChange={setRepostDialogOpen} 
          post={selectedPost} 
        />
      )}
    </div>
  );
};

export default PostFeed;
