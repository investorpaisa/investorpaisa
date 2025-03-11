
import React from 'react';
import PostCard from './PostCard';
import EmptyFeedState from './EmptyFeedState';
import RefreshingIndicator from './RefreshingIndicator';
import { RepostDialog } from '@/components/engagement/RepostDialog';
import { useCommentsDialog } from '@/hooks/useCommentsDialog';
import { useFeedActions } from './useFeedActions';

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
  const { openComments } = useCommentsDialog();
  const { 
    likedPosts,
    savedPosts,
    refreshing,
    repostDialogOpen,
    selectedPost,
    handleLike,
    handleSave,
    handleRepost,
    setRepostDialogOpen,
    handleRefresh
  } = useFeedActions();

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

  return (
    <div className="space-y-6">
      <RefreshingIndicator isRefreshing={refreshing} />
      
      <div className="space-y-6">
        {feedPosts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            isLiked={!!likedPosts[post.id]}
            isSaved={!!savedPosts[post.id]}
            onLike={handleLike}
            onComment={handleComment}
            onRepost={handleRepost}
            onSave={handleSave}
          />
        ))}
      </div>
      
      {feedPosts.length === 0 && <EmptyFeedState />}
      
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
