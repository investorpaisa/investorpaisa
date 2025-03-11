
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, Share2, Bookmark } from 'lucide-react';

interface Post {
  id: number;
  likes: number;
  comments: number;
  shares: number;
}

interface PostCardActionsProps {
  post: Post;
  isLiked: boolean;
  isSaved: boolean;
  onLike: (postId: number) => void;
  onComment: (post: Post) => void;
  onRepost: (post: Post) => void;
  onSave: (postId: number) => void;
}

const PostCardActions = ({ 
  post, 
  isLiked, 
  isSaved, 
  onLike, 
  onComment, 
  onRepost, 
  onSave 
}: PostCardActionsProps) => {
  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className={`gap-1 ${isLiked ? 'text-ip-teal' : ''}`}
          onClick={() => onLike(post.id)}
        >
          <Heart className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
          <span>{post.likes + (isLiked ? 1 : 0)}</span>
        </Button>
        <Button variant="ghost" size="sm" className="gap-1" onClick={() => onComment(post)}>
          <MessageSquare className="h-4 w-4" />
          <span>{post.comments}</span>
        </Button>
        <Button variant="ghost" size="sm" className="gap-1" onClick={() => onRepost(post)}>
          <Share2 className="h-4 w-4" />
          <span>{post.shares}</span>
        </Button>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        className={isSaved ? 'text-ip-teal' : ''}
        onClick={() => onSave(post.id)}
      >
        <Bookmark className="h-4 w-4" fill={isSaved ? "currentColor" : "none"} />
      </Button>
    </div>
  );
};

export default PostCardActions;
