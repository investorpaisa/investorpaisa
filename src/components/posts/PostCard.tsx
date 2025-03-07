
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { PostActions } from '@/components/engagement/PostActions';
import { Comments } from '@/components/engagement/Comments';
import { Post } from '@/types';

interface PostCardProps {
  post: Post;
  showComments?: boolean;
  isPinned?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  showComments = false,
  isPinned = false
}) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(showComments);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [commentsCount, setCommentsCount] = useState(post.comment_count || 0);

  const handleLikeToggle = (isLiked: boolean) => {
    setLikesCount(prevCount => isLiked ? prevCount + 1 : prevCount - 1);
  };

  const handleCommentClick = () => {
    setIsCommentsOpen(prev => !prev);
  };

  const handleCommentCountChange = (count: number) => {
    setCommentsCount(count);
  };

  return (
    <Card className={`mb-4 overflow-hidden transition-all duration-200 ${isPinned ? 'border-gold shadow-gold/20' : ''}`}>
      {isPinned && (
        <div className="bg-gold text-white text-xs px-3 py-1 text-center">
          Pinned Post
        </div>
      )}
      <CardContent className="p-4">
        {/* Post Header */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar>
            <AvatarImage src={post.author?.avatar_url || ''} />
            <AvatarFallback>
              {post.author?.full_name?.substring(0, 2).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center">
              <Link to={`/profile/${post.author?.id}`} className="font-medium hover:underline">
                {post.author?.full_name || 'Unknown User'}
              </Link>
              {post.author?.role === 'expert' && (
                <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-1 rounded">Expert</span>
              )}
            </div>
            <div className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              {post.category && (
                <>
                  <span className="mx-1">•</span>
                  <Link to={`/category/${post.category}`} className="hover:underline">
                    {post.category}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Post Content */}
        <div>
          <h3 className="text-lg font-medium mb-2">{post.title}</h3>
          <p className="text-gray-800 mb-4">{post.content}</p>
        </div>
        
        {/* Post Actions */}
        <PostActions 
          postId={post.id}
          likesCount={likesCount}
          commentsCount={commentsCount}
          onLikeToggle={handleLikeToggle}
          onCommentClick={handleCommentClick}
        />
        
        {/* Comments Section */}
        {isCommentsOpen && (
          <Comments 
            postId={post.id} 
            onCommentCountChange={handleCommentCountChange}
          />
        )}
      </CardContent>
    </Card>
  );
};
