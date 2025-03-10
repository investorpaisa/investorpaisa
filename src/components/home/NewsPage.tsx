
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NewsSection from '@/components/news/NewsSection';
import TrendingTopics from '@/components/feed/TrendingTopics';
import PostFeed from '@/components/feed/PostFeed';
import { useHomeFeedData } from '@/hooks/useHomeFeedData';
import { useIsMobile } from '@/hooks/use-mobile';
import { TabsList, TabsTrigger, Tabs } from '@/components/ui/tabs';

const NewsPage = () => {
  const { feedPosts, trendingTopics, loading } = useHomeFeedData();
  const isMobile = useIsMobile();

  // Trigger news fetch when component mounts
  useEffect(() => {
    // This effect intentionally left empty as the NewsSection component
    // handles its own data fetching
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading feed data...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Financial News & Insights</h1>
        <p className="text-muted-foreground">Stay updated with the latest financial news, trends, and market insights.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* News Section - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <NewsSection />
          
          {/* User generated content */}
          <PostFeed feedPosts={feedPosts} />
        </div>
        
        {/* Right Sidebar */}
        {!isMobile && (
          <div className="space-y-6">
            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trending Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <TrendingTopics topics={trendingTopics} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
