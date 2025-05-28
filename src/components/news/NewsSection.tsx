
import { useState, useEffect } from 'react';
import { NewsArticle } from '@/types';
import { getLatestNews, triggerNewsFetch } from '@/services/news/newsService';
import NewsCard from './NewsCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface NewsSectionProps {
  limit?: number;
}

const NewsSection = ({ limit = 5 }: NewsSectionProps) => {
  const [latestNews, setLatestNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const latest = await getLatestNews(limit);
      setLatestNews(latest);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshNews = async () => {
    setIsRefreshing(true);
    try {
      // Trigger the crawler to fetch new content
      await triggerNewsFetch();
      // Then fetch the updated news
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
    
    // Refresh the news every 10 minutes
    const refreshInterval = setInterval(() => {
      fetchNews();
    }, 10 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, [limit]);

  const handleBookmark = (articleId: string) => {
    console.log('Bookmark article:', articleId);
    toast({
      title: 'Article Bookmarked',
      description: 'This article has been saved to your bookmarks.',
    });
  };

  const handleShare = (articleId: string) => {
    console.log('Share article:', articleId);
    navigator.clipboard.writeText(
      latestNews.find(article => article.id === articleId)?.url || ''
    );
    toast({
      title: 'Link Copied',
      description: 'Article link has been copied to clipboard.',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-4 w-3/4 mb-2 rounded"></div>
            <div className="bg-gray-200 h-3 w-1/2 mb-2 rounded"></div>
            <div className="bg-gray-200 h-20 w-full rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (latestNews.length === 0) {
    return (
      <div className="text-center py-8 space-y-4">
        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground" />
        <div>
          <p className="text-muted-foreground mb-4">No news articles available at the moment.</p>
          <Button 
            variant="outline" 
            onClick={refreshNews} 
            disabled={isRefreshing}
            className="gap-2"
          >
            {isRefreshing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Loading News...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Load News
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Latest Financial News</h2>
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
      
      <div className="space-y-4">
        {latestNews.map((article) => (
          <NewsCard
            key={article.id}
            article={article}
            onBookmark={handleBookmark}
            onShare={handleShare}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsSection;
