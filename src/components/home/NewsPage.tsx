
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PostFeed from '@/components/feed/PostFeed';
import CategoryNewsSection from '@/components/news/CategoryNewsSection';
import { useHomeFeedData } from '@/hooks/useHomeFeedData';
import { CreatePostForm } from '@/components/posts/CreatePostForm';

const NewsPage = () => {
  const { feedPosts, loading, addPost } = useHomeFeedData();

  const handlePostCreated = (newPost) => {
    addPost(newPost);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-6">
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
    </div>
  );
};

export default NewsPage;
