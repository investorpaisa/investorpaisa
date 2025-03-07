
import { useState, useEffect } from 'react';
import { bookmarkService } from '@/services/engagement';
import { Post } from '@/types';

export const useBookmarks = () => {
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookmarkedPosts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const posts = await bookmarkService.getBookmarkedPosts();
        setBookmarkedPosts(posts);
      } catch (err) {
        console.error('Error fetching bookmarked posts:', err);
        setError('Failed to fetch bookmarks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookmarkedPosts();
  }, []);

  return { bookmarkedPosts, loading, error };
};
