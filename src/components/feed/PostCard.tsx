
import React from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import PostCardHeader from './PostCardHeader';
import PostCardContent from './PostCardContent';
import PostCardActions from './PostCardActions';

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

interface PostCardProps {
  post: Post;
  isLiked: boolean;
  isSaved: boolean;
  onLike: (postId: number) => void;
  onComment: (post: Post) => void;
  onRepost: (post: Post) => void;
  onSave: (postId: number) => void;
}

const PostCard = ({ 
  post, 
  isLiked, 
  isSaved,
  onLike, 
  onComment, 
  onRepost, 
  onSave 
}: PostCardProps) => {
  return (
    <Card className="border shadow-sm animate-hover-rise">
      <CardHeader className="p-4 pb-2">
        <PostCardHeader 
          author={post.author}
          category={post.category}
          timestamp={post.timestamp}
        />
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <PostCardContent 
          title={post.title}
          content={post.content}
        />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <PostCardActions 
          post={post}
          isLiked={isLiked}
          isSaved={isSaved}
          onLike={onLike}
          onComment={onComment}
          onRepost={onRepost}
          onSave={onSave}
        />
      </CardFooter>
    </Card>
  );
};

export default PostCard;
