
import React, { useRef, useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import NewsPage from '@/components/home/NewsPage';
import { CommentsDialog } from '@/components/news/CommentsDialog';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const MIN_PULL_DISTANCE = 100;

const Home = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<number | null>(null);
  const pullDistanceRef = useRef<number>(0);
  const [isPulling, setIsPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const isMobile = useIsMobile();

  const handleTouchStart = (e: TouchEvent) => {
    // Only enable pull to refresh when at the top of the page
    if (window.scrollY === 0) {
      touchStartRef.current = e.touches[0].clientY;
    } else {
      touchStartRef.current = null;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (touchStartRef.current === null || refreshing) return;

    const touchY = e.touches[0].clientY;
    const pullDistance = touchY - touchStartRef.current;

    // Only proceed if pulling down
    if (pullDistance > 0) {
      pullDistanceRef.current = Math.min(pullDistance, 200);
      setIsPulling(true);
    } else {
      pullDistanceRef.current = 0;
      setIsPulling(false);
    }
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current || refreshing) return;

    if (pullDistanceRef.current >= MIN_PULL_DISTANCE) {
      refreshContent();
    }

    touchStartRef.current = null;
    pullDistanceRef.current = 0;
    setIsPulling(false);
  };

  const refreshContent = async () => {
    setRefreshing(true);
    
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // After refresh completes
    setRefreshing(false);
    toast.success('Feed refreshed');
  };

  useEffect(() => {
    if (isMobile) {
      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isMobile, refreshing]);

  return (
    <>
      {isMobile && (isPulling || refreshing) && (
        <div 
          className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center py-4 bg-background"
          style={{
            height: refreshing ? '60px' : `${Math.min(pullDistanceRef.current / 2, 60)}px`,
            transition: refreshing ? 'none' : 'height 0.2s'
          }}
        >
          <RefreshCw 
            className={`h-6 w-6 text-gold ${refreshing ? 'animate-spin' : 'animate-bounce'}`} 
          />
        </div>
      )}
      <div ref={containerRef} className="w-full">
        <NewsPage />
        <CommentsDialog />
      </div>
    </>
  );
}

export default Home;
