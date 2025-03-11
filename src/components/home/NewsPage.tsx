
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NewsSection from '@/components/news/NewsSection';
import TrendingTopics from '@/components/feed/TrendingTopics';
import PostFeed from '@/components/feed/PostFeed';
import { useHomeFeedData } from '@/hooks/useHomeFeedData';
import { useIsMobile } from '@/hooks/use-mobile';
import { TabsList, TabsTrigger, Tabs, TabsContent } from '@/components/ui/tabs';
import { CreatePostForm } from '@/components/posts/CreatePostForm';
import { GeminiSearch } from '@/components/search/GeminiSearch';

const NewsPage = () => {
  const { feedPosts, trendingTopics, loading } = useHomeFeedData();
  const isMobile = useIsMobile();
  const [searchExpanded, setSearchExpanded] = useState(false);

  return (
    <div>
      <div className="sticky top-0 z-10 bg-background pb-4 pt-2">
        <GeminiSearch 
          expanded={searchExpanded} 
          onExpandToggle={setSearchExpanded}
          trendingTopics={trendingTopics}
        />
      </div>

      {!searchExpanded && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
          {/* Left Content Area - 2/3 width on desktop */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post Form - Top of the feed */}
            <CreatePostForm compact={true} />
            
            {/* Unified Feed */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid grid-cols-4 h-auto mb-4">
                <TabsTrigger value="all" className="py-2">All</TabsTrigger>
                <TabsTrigger value="news" className="py-2">News</TabsTrigger>
                <TabsTrigger value="community" className="py-2">Community</TabsTrigger>
                <TabsTrigger value="for-you" className="py-2">For You</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-6">
                {/* News Section */}
                <NewsSection />
                
                {/* User generated content */}
                <PostFeed feedPosts={feedPosts} />
              </TabsContent>
              
              <TabsContent value="news" className="space-y-6">
                <NewsSection />
              </TabsContent>
              
              <TabsContent value="community" className="space-y-6">
                <PostFeed feedPosts={feedPosts} />
              </TabsContent>
              
              <TabsContent value="for-you" className="space-y-6">
                <div className="p-6 text-center bg-muted rounded-md">
                  <h3 className="font-medium mb-2">Personalized feed coming soon</h3>
                  <p className="text-muted-foreground text-sm">We're working on tailoring content just for you based on your interests.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right Sidebar - Hidden on mobile */}
          {!isMobile && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Financial Education</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-md border overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1633158829875-e5316a358c6f?q=80&w=2070" 
                        alt="Financial Education" 
                        className="w-full h-32 object-cover" 
                      />
                      <div className="p-3">
                        <h4 className="font-medium text-sm">Investment Basics</h4>
                        <p className="text-xs text-muted-foreground mt-1">Learn the fundamentals of investing and building wealth</p>
                      </div>
                    </div>
                    <div className="rounded-md border overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=1887" 
                        alt="Tax Planning" 
                        className="w-full h-32 object-cover" 
                      />
                      <div className="p-3">
                        <h4 className="font-medium text-sm">Tax Planning</h4>
                        <p className="text-xs text-muted-foreground mt-1">Strategies to minimize your tax burden legally</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NewsPage;
