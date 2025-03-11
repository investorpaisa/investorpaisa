
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
  const { feedPosts, trendingTopics, loading, addPost } = useHomeFeedData();
  const isMobile = useIsMobile();
  const [searchExpanded, setSearchExpanded] = useState(false);

  const handlePostCreated = (newPost) => {
    // Add the new post to the feed
    addPost(newPost);
  };

  // Transform trendingTopics to the format expected by GeminiSearch
  const formattedTrendingTopics = trendingTopics.map(topic => ({
    id: topic.id.toString(),
    name: topic.topic
  }));

  return (
    <div className="max-w-4xl mx-auto">
      <div className={`sticky top-0 z-10 bg-background pb-4 pt-2 ${isMobile ? 'px-0' : ''}`}>
        <GeminiSearch 
          expanded={searchExpanded} 
          onExpandToggle={setSearchExpanded}
          trendingTopics={formattedTrendingTopics}
        />
      </div>

      {!searchExpanded && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
          {/* Left Content Area - 2/3 width on desktop */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post Form - Top of the feed */}
            <CreatePostForm compact={true} onPostCreated={handlePostCreated} />
            
            {/* Unified Feed */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid grid-cols-2 h-auto mb-4">
                <TabsTrigger value="all" className="py-2">All</TabsTrigger>
                <TabsTrigger value="trending" className="py-2">Trending</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-6">
                {/* News Section */}
                <NewsSection />
                
                {/* User generated content */}
                <PostFeed feedPosts={feedPosts} />
              </TabsContent>
              
              <TabsContent value="trending" className="space-y-6">
                <NewsSection />
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
