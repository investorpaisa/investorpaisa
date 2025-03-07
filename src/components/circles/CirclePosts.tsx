
import React from 'react';
import { Button } from '@/components/ui/button';
import { EnhancedPost } from '@/types';
import { PlusCircle, Pin } from 'lucide-react';
import PostCard from '@/components/posts/PostCard';

interface CirclePostsProps {
  posts: EnhancedPost[];
  isMember: boolean;
  onCreatePost: () => void;
  onPostClick: (post: EnhancedPost) => void;
}

export function CirclePosts({ posts, isMember, onCreatePost, onPostClick }: CirclePostsProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">No posts yet</h3>
        <p className="text-muted-foreground mt-1">Be the first to post in this circle!</p>
        {isMember && (
          <Button className="mt-4" onClick={onCreatePost}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Post
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <div key={post.id} className="relative">
          {post.is_pinned && (
            <div className="absolute top-2 right-2 z-10 bg-secondary text-xs px-2 py-1 rounded-full flex items-center">
              <Pin className="h-3 w-3 mr-1" /> Pinned
            </div>
          )}
          <PostCard 
            post={post}
            isClickable
            onClick={() => onPostClick(post)}
          />
        </div>
      ))}
    </div>
  );
}
