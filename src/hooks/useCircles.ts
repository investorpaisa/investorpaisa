
import { useQuery } from '@tanstack/react-query';
import { Circle } from '@/types';

// Mock circles data for demonstration - circles functionality has been deprecated
const mockCircles: Circle[] = [
  {
    id: '1',
    name: 'Investment Strategies',
    description: 'Discuss various investment strategies and approaches',
    type: 'public',
    created_at: new Date().toISOString(),
    created_by: 'user1',
    member_count: 256,
    post_count: 42,
    hasNewPost: true
  },
  {
    id: '2',
    name: 'Tax Planning',
    description: 'Private group for tax planning and optimization',
    type: 'private',
    created_at: new Date().toISOString(),
    created_by: 'user2',
    member_count: 128,
    post_count: 23,
    hasNewPost: false
  }
];

export const useUserCircles = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['userCircles', userId],
    queryFn: () => Promise.resolve(userId ? mockCircles : []),
    enabled: !!userId,
  });
};

export const usePublicCircles = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['publicCircles', page, limit],
    queryFn: () => Promise.resolve(mockCircles.filter(c => c.type === 'public')),
  });
};

export const useTrendingCircles = (limit = 5) => {
  return useQuery({
    queryKey: ['trendingCircles', limit],
    queryFn: () => Promise.resolve(mockCircles.slice(0, limit)),
  });
};

// Add a new hook that combines the functionality of the other hooks
export const useCircles = (userId?: string) => {
  const userCirclesQuery = useUserCircles(userId);
  
  return {
    circles: userCirclesQuery.data || [],
    isLoading: userCirclesQuery.isLoading,
    error: userCirclesQuery.error,
  };
};
