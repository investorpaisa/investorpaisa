
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NewsSection from '@/components/news/NewsSection';
import PostFeed from '@/components/feed/PostFeed';
import { useHomeFeedData } from '@/hooks/useHomeFeedData';
import { useIsMobile } from '@/hooks/use-mobile';
import { CreatePostForm } from '@/components/posts/CreatePostForm';
import { GeminiSearch } from '@/components/search/GeminiSearch';
import MarketTicker from '@/components/market/MarketTicker';

const NewsPage = () => {
  const { feedPosts, trendingTopics, loading, addPost } = useHomeFeedData();
  const isMobile = useIsMobile();
  const [searchExpanded, setSearchExpanded] = useState(false);

  const handlePostCreated = (newPost) => {
    // Add the new post to the feed
    addPost(newPost);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className={`sticky top-0 z-10 bg-background pb-4 pt-2 ${isMobile ? 'px-0' : ''}`}>
        <GeminiSearch 
          expanded={searchExpanded} 
          onExpandToggle={setSearchExpanded}
          trendingTopics={trendingTopics}
        />
      </div>

      {!searchExpanded && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
          <div className="lg:col-span-2 space-y-6">
            <CreatePostForm compact={true} onPostCreated={handlePostCreated} />
            
            <NewsSection />
            
            <PostFeed feedPosts={feedPosts} />
          </div>
          
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
      
      {/* Market Ticker Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-10">
        <MarketTicker />
      </div>
    </div>
  );
};

export default NewsPage;
