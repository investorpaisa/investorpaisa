
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Rss } from 'lucide-react';
import { useNews } from '@/hooks/useNews';
import NewsCard from './NewsCard';
import { useToast } from '@/hooks/use-toast';

interface CategoryNewsSectionProps {
  title: string;
  topic: string;
  category: string;
  limit?: number;
  autoRefresh?: boolean;
  showCrawlButton?: boolean;
}

const CategoryNewsSection = ({
  title,
  topic,
  category,
  limit = 5,
  autoRefresh = false
}: CategoryNewsSectionProps) => {
  const { toast } = useToast();
  const {
    news: articles,
    isLoading,
    error,
    refreshNews,
    isRefreshing
  } = useNews(category, limit, autoRefresh);

  const handleBookmark = (articleId: string) => {
    console.log('Bookmark article:', articleId);
    toast({
      title: 'Article Bookmarked',
      description: 'This article has been saved to your bookmarks.',
    });
  };

  const handleShare = (articleId: string) => {
    console.log('Share article:', articleId);
    const article = articles.find(a => a.id === articleId);
    if (article?.url) {
      navigator.clipboard.writeText(article.url);
      toast({
        title: 'Link Copied',
        description: 'Article link has been copied to clipboard.',
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
                <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
                <div className="bg-gray-200 h-20 w-full rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{title}</CardTitle>
            <Rss className="h-4 w-4 text-blue-500" />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshNews}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
        <CardDescription>Real-time news from RSS feeds</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}
        
        {articles.length === 0 && !isLoading && !error && (
          <div className="text-center py-8 text-muted-foreground">
            <Rss className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No articles available yet.</p>
            <Button
              variant="outline"
              className="mt-3"
              onClick={refreshNews}
              disabled={isRefreshing}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Load Articles
            </Button>
          </div>
        )}
        
        {articles.map((article) => (
          <NewsCard
            key={article.id}
            article={article}
            onBookmark={handleBookmark}
            onShare={handleShare}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default CategoryNewsSection;
