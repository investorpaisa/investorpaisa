
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PostFeed from '@/components/feed/PostFeed';
import CategoryNewsSection from '@/components/news/CategoryNewsSection';
import { useHomeFeedData } from '@/hooks/useHomeFeedData';
import { useIsMobile } from '@/hooks/use-mobile';
import { CreatePostForm } from '@/components/posts/CreatePostForm';

const NewsPage = () => {
  const { feedPosts, loading, addPost } = useHomeFeedData();
  const isMobile = useIsMobile();

  const handlePostCreated = (newPost) => {
    addPost(newPost);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CreatePostForm compact={true} onPostCreated={handlePostCreated} />
          
          <Tabs defaultValue="trending" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
              <TabsTrigger value="markets">Markets</TabsTrigger>
              <TabsTrigger value="crypto">Crypto</TabsTrigger>
            </TabsList>
            
            <TabsContent value="trending" className="mt-6">
              <CategoryNewsSection
                title="Trending Financial News"
                topic="trending financial news and market updates"
                category="Business"
                limit={6}
                autoRefresh={true}
              />
            </TabsContent>
            
            <TabsContent value="business" className="mt-6">
              <CategoryNewsSection
                title="Business News"
                topic="business news corporate earnings and company updates"
                category="Business"
                limit={5}
              />
            </TabsContent>
            
            <TabsContent value="markets" className="mt-6">
              <CategoryNewsSection
                title="Market Analysis"
                topic="stock market analysis investment insights and economic indicators"
                category="Markets"
                limit={5}
              />
            </TabsContent>
            
            <TabsContent value="crypto" className="mt-6">
              <CategoryNewsSection
                title="Cryptocurrency News"
                topic="cryptocurrency blockchain and digital assets news"
                category="Cryptocurrency"
                limit={5}
              />
            </TabsContent>
          </Tabs>
          
          <PostFeed feedPosts={feedPosts} />
        </div>
        
        {!isMobile && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Market Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryNewsSection
                  title="Market Highlights"
                  topic="daily market highlights and key economic data"
                  category="Economy"
                  limit={3}
                  showCrawlButton={false}
                />
              </CardContent>
            </Card>
            
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
    </div>
  );
};

export default NewsPage;
