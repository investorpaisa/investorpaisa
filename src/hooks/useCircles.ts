
import { useQuery } from '@tanstack/react-query';
import { Circle } from '@/types';
import { 
  getUserCircles, 
  getPublicCircles, 
  getTrendingCircles 
} from '@/services/circles';

export const useUserCircles = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['userCircles', userId],
    queryFn: () => userId ? getUserCircles(userId) : Promise.resolve([]),
    enabled: !!userId,
  });
};

export const usePublicCircles = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['publicCircles', page, limit],
    queryFn: () => getPublicCircles(page, limit),
  });
};

export const useTrendingCircles = (limit = 5) => {
  return useQuery({
    queryKey: ['trendingCircles', limit],
    queryFn: () => getTrendingCircles(limit),
  });
};
