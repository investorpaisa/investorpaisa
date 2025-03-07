
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { likeService, bookmarkService, shareService } from '@/services/engagement';
import { toast } from '@/hooks/use-toast';
import { 
  Heart, ThumbsUp, MessageSquare, Share, Bookmark, 
  ThumbsUpIcon, HeartIcon, BookmarkIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleIcon } from '../circles/CircleIcon';
import { useNavigate } from 'react-router-dom';
import { circleService } from '@/services/circles/circleService';
import { Circle } from '@/types';

interface PostActionsProps {
  postId: string;
  likesCount: number;
  commentsCount: number;
  onLikeToggle?: (isLiked: boolean) => void;
  onCommentClick?: () => void;
}

export const PostActions: React.FC<PostActionsProps> = ({
  postId,
  likesCount,
  commentsCount,
  onLikeToggle,
  onCommentClick
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userCircles, setUserCircles] = useState<Circle[]>([]);
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingBookmark, setLoadingBookmark] = useState(false);
  const [loadingShare, setLoadingShare] = useState(false);

  useEffect(() => {
    if (user) {
      // Check if post is already liked
      const checkLikeStatus = async () => {
        const liked = await likeService.isPostLiked(postId);
        setIsLiked(liked);
      };

      // Check if post is already bookmarked
      const checkBookmarkStatus = async () => {
        const bookmarked = await bookmarkService.isPostBookmarked(postId);
        setIsBookmarked(bookmarked);
      };

      // Get user's circles for sharing
      const getUserCircles = async () => {
        const circles = await circleService.getUserCircles();
        setUserCircles(circles);
      };

      checkLikeStatus();
      checkBookmarkStatus();
      getUserCircles();
    }
  }, [postId, user]);

  const handleLikeToggle = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like posts",
        variant: "destructive"
      });
      return;
    }

    setLoadingLike(true);
    try {
      const newLikeStatus = await likeService.toggleLike(postId);
      setIsLiked(newLikeStatus);
      if (onLikeToggle) {
        onLikeToggle(newLikeStatus);
      }
    } finally {
      setLoadingLike(false);
    }
  };

  const handleBookmarkToggle = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to bookmark posts",
        variant: "destructive"
      });
      return;
    }

    setLoadingBookmark(true);
    try {
      const newBookmarkStatus = await bookmarkService.toggleBookmark(postId);
      setIsBookmarked(newBookmarkStatus);
      
      toast({
        title: newBookmarkStatus ? "Post bookmarked" : "Bookmark removed",
        description: newBookmarkStatus 
          ? "Post has been added to your bookmarks" 
          : "Post has been removed from your bookmarks"
      });
    } finally {
      setLoadingBookmark(false);
    }
  };

  const handleShareToCircle = async (circleId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to share posts",
        variant: "destructive"
      });
      return;
    }

    setLoadingShare(true);
    try {
      await shareService.sharePost(postId, 'circle', circleId);
    } finally {
      setLoadingShare(false);
    }
  };

  const handlePublicShare = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to share posts",
        variant: "destructive"
      });
      return;
    }

    setLoadingShare(true);
    try {
      await shareService.sharePost(postId, 'public');
    } finally {
      setLoadingShare(false);
    }
  };

  const handleCommentClick = () => {
    if (onCommentClick) {
      onCommentClick();
    }
  };

  return (
    <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-100">
      <Button 
        variant="ghost" 
        size="sm" 
        className="flex items-center gap-1 text-sm font-normal"
        onClick={handleLikeToggle}
        disabled={loadingLike}
      >
        {isLiked ? (
          <ThumbsUpIcon className="h-4 w-4 text-gold fill-gold" />
        ) : (
          <ThumbsUp className="h-4 w-4" />
        )}
        <span>{likesCount}</span>
      </Button>

      <Button 
        variant="ghost" 
        size="sm" 
        className="flex items-center gap-1 text-sm font-normal"
        onClick={handleCommentClick}
      >
        <MessageSquare className="h-4 w-4" />
        <span>{commentsCount}</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1 text-sm font-normal"
            disabled={loadingShare}
          >
            <Share className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handlePublicShare}>
            Share to public feed
          </DropdownMenuItem>
          
          {userCircles.length > 0 && (
            <>
              <Separator className="my-1" />
              <div className="text-xs text-gray-500 px-2 my-1">Share to circle</div>
              {userCircles.map(circle => (
                <DropdownMenuItem 
                  key={circle.id}
                  onClick={() => handleShareToCircle(circle.id)}
                  className="flex items-center gap-2"
                >
                  <CircleIcon name={circle.name} size="sm" />
                  <span>{circle.name}</span>
                </DropdownMenuItem>
              ))}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button 
        variant="ghost" 
        size="sm" 
        className="flex items-center gap-1 text-sm font-normal"
        onClick={handleBookmarkToggle}
        disabled={loadingBookmark}
      >
        {isBookmarked ? (
          <BookmarkIcon className="h-4 w-4 text-gold fill-gold" />
        ) : (
          <Bookmark className="h-4 w-4" />
        )}
        <span>Save</span>
      </Button>
    </div>
  );
};
