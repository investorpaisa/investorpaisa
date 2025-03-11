
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent } from '@/components/ui/card';
import NewsPage from '@/components/home/NewsPage';
import { CommentsDialog } from '@/components/news/CommentsDialog';

const Home = () => {
  return (
    <>
      <NewsPage />
      <CommentsDialog />
    </>
  );
};

export default Home;
