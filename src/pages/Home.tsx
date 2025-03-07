
import React, { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import MarketInsights from '@/components/market/MarketInsights';
import PostFeed from '@/components/feed/PostFeed';
import TrendingTopics from '@/components/feed/TrendingTopics';
import FinancialNewsSection from '@/components/feed/FinancialNewsSection';
import { useHomeFeedData } from '@/hooks/useHomeFeedData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Home = () => {
  const isMobile = useIsMobile();
  const { feedPosts, trendingTopics, loading } = useHomeFeedData();

  useEffect(() => {
    // Refresh news when the feed loads
    // Set up a refresh interval (every 30 minutes) is handled in FinancialNewsSection
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading feed data...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Home</h1>
        <p className="text-muted-foreground">Your personalized financial feed and market updates.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Data Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Market Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <MarketInsights />
            </CardContent>
          </Card>
          
          {/* Posts Feed */}
          <PostFeed feedPosts={feedPosts} />
        </div>
        
        {/* Right Sidebar */}
        {!isMobile && (
          <div className="space-y-6">
            {/* Financial News Section */}
            <FinancialNewsSection limit={5} />

            {/* Trending Topics */}
            <TrendingTopics topics={trendingTopics} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
