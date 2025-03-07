
import { useState, useEffect } from 'react';
import { NewsArticle } from '@/types';
import { getLatestNews, getTrendingNews } from '@/services/news/newsService';
import NewsCard from './NewsCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface NewsSectionProps {
  limit?: number;
}

const NewsSection = ({ limit = 5 }: NewsSectionProps) => {
  const [latestNews, setLatestNews] = useState<NewsArticle[]>([]);
  const [trendingNews, setTrendingNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('latest');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const [latest, trending] = await Promise.all([
        getLatestNews(limit),
        getTrendingNews(limit)
      ]);
      
      setLatestNews(latest);
      setTrendingNews(trending);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshNews = async () => {
    setIsRefreshing(true);
    try {
      await fetchNews();
      toast({
        title: 'News Refreshed',
        description: 'Latest financial news has been loaded.',
      });
    } catch (error) {
      toast({
        title: 'Refresh Failed',
        description: 'Could not refresh news content. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
    
    // Refresh the news every 5 minutes
    const refreshInterval = setInterval(() => {
      fetchNews();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, [limit]);

  const handleBookmark = (articleId: string) => {
    // Bookmark functionality would go here
    console.log('Bookmark article:', articleId);
    toast({
      title: 'Article Bookmarked',
      description: 'This article has been saved to your bookmarks.',
    });
  };

  const handleShare = (articleId: string) => {
    // Share functionality would go here
    console.log('Share article:', articleId);
    navigator.clipboard.writeText(
      latestNews.find(article => article.id === articleId)?.url || 
      trendingNews.find(article => article.id === articleId)?.url || 
      ''
    );
    toast({
      title: 'Link Copied',
      description: 'Article link has been copied to clipboard.',
    });
  };

  const displayNews = activeTab === 'latest' ? latestNews : trendingNews;

  if (isLoading) {
    return (
      <Card className="border shadow-sm">
        <CardContent className="p-4 flex justify-center items-center min-h-[200px]">
          <div className="flex flex-col items-center space-y-4">
            <RefreshCw className="h-8 w-8 animate-spin text-ip-teal" />
            <p className="text-sm text-muted-foreground">Loading financial news...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (displayNews.length === 0) {
    return (
      <Card className="border shadow-sm">
        <CardContent className="p-4 flex justify-center items-center min-h-[200px]">
          <div className="flex flex-col items-center space-y-4">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No financial news available at the moment.</p>
            <Button variant="outline" size="sm" onClick={refreshNews} disabled={isRefreshing}>
              {isRefreshing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Financial News</CardTitle>
            <CardDescription>Stay updated with market trends</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={refreshNews}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs defaultValue="latest" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 h-auto mb-4">
            <TabsTrigger value="latest" className="py-2">Latest</TabsTrigger>
            <TabsTrigger value="trending" className="py-2">Trending</TabsTrigger>
          </TabsList>
          
          <TabsContent value="latest" className="mt-0 p-0 space-y-4">
            {latestNews.map((article) => (
              <NewsCard
                key={article.id}
                article={article}
                onBookmark={handleBookmark}
                onShare={handleShare}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="trending" className="mt-0 p-0 space-y-4">
            {trendingNews.map((article) => (
              <NewsCard
                key={article.id}
                article={article}
                onBookmark={handleBookmark}
                onShare={handleShare}
              />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NewsSection;
