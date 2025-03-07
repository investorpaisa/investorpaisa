// Update imports to use the new service structure
import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark,
  Link2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Post } from '@/types';
import { likeService } from '@/services/engagement';
import { bookmarkService } from '@/services/engagement';
import { getCircleById } from '@/services/circles';

interface PostActionsProps {
  post: Post;
  isLiked: boolean;
  likeCount: number;
  isBookmarked: boolean;
  onLike: (postId: string, liked: boolean) => Promise<void>;
  onBookmark: (postId: string, bookmarked: boolean) => Promise<void>;
}

export function PostActions({ 
  post, 
  isLiked, 
  likeCount, 
  isBookmarked,
  onLike,
  onBookmark
}: PostActionsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

  const handleLike = async () => {
    if (!user) {
      toast({
        title: 'You must be logged in to like this post.',
      });
      return;
    }

    setIsLikeLoading(true);
    try {
      await onLike(post.id, !isLiked);
    } catch (error) {
      console.error('Error liking post:', error);
      toast({
        title: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      toast({
        title: 'You must be logged in to bookmark this post.',
      });
      return;
    }

    setIsBookmarkLoading(true);
    try {
      await onBookmark(post.id, !isBookmarked);
    } catch (error) {
      console.error('Error bookmarking post:', error);
      toast({
        title: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  const handleShare = async () => {
    if (!user) {
      toast({
        title: 'You must be logged in to share this post.',
      });
      return;
    }

    // Logic to share the post (e.g., open a share dialog)
    toast({
      title: 'Share feature is under development.',
    });
  };

  return (
    <div className="flex items-center gap-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              onClick={handleLike}
              disabled={isLikeLoading}
            >
              <Heart className={cn("h-5 w-5", isLiked && "text-red-500")} />
              <span className="ml-2">{likeCount}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isLiked ? 'Unlike' : 'Like'} this post</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost">
              <MessageCircle className="h-5 w-5" />
              <span className="ml-2">{post.comment_count || 0}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Comment on this post</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share this post</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost"
              onClick={handleBookmark}
              disabled={isBookmarkLoading}
            >
              <Bookmark className={cn("h-5 w-5", isBookmarked && "text-blue-500")} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isBookmarked ? 'Remove Bookmark' : 'Bookmark'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
