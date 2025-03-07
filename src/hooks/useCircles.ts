
import { useState, useEffect } from 'react';
import { circleService } from '@/services/circles/circleService';
import { Circle } from '@/types';

export const useCircles = (type?: 'public' | 'private' | 'user') => {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCircles = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let fetchedCircles: Circle[] = [];
        
        if (type === 'public') {
          fetchedCircles = await circleService.getCirclesByType('public');
        } else if (type === 'private') {
          fetchedCircles = await circleService.getCirclesByType('private');
        } else if (type === 'user') {
          fetchedCircles = await circleService.getUserCircles();
        } else {
          fetchedCircles = await circleService.getAllCircles();
        }
        
        setCircles(fetchedCircles);
      } catch (err) {
        console.error('Error fetching circles:', err);
        setError('Failed to fetch circles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCircles();
  }, [type]);

  return { circles, loading, error };
};
