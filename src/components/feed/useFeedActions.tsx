
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

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

export const useFeedActions = (initialSavedPosts: Record<number, boolean> = { 2: true }) => {
  const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>({});
  const [savedPosts, setSavedPosts] = useState<Record<number, boolean>>(initialSavedPosts);
  const [refreshing, setRefreshing] = useState(false);
  const [repostDialogOpen, setRepostDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

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

  return {
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
  };
};
