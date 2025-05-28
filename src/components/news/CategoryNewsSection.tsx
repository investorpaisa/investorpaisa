
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Bot, Sparkles } from 'lucide-react';
import { useGeminiContent } from '@/hooks/useGeminiContent';
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
  autoRefresh = false,
  showCrawlButton = true
}: CategoryNewsSectionProps) => {
  const { toast } = useToast();
  const {
    articles,
    isLoading,
    isCrawling,
    error,
    refreshContent,
    crawlNewContent
  } = useGeminiContent({
    topic,
    category,
    limit,
    autoRefresh
  });

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

  const handleCrawl = async () => {
    try {
      await crawlNewContent();
      toast({
        title: 'New Content Generated',
        description: `Fresh ${category.toLowerCase()} articles have been generated using AI.`,
      });
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate new content. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center min-h-[200px]">
          <div className="flex flex-col items-center space-y-4">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-sm text-muted-foreground">Loading {title.toLowerCase()}...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              {title}
              <Bot className="h-4 w-4 text-blue-500" />
            </CardTitle>
            <CardDescription>AI-powered content from across the web</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshContent}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            {showCrawlButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCrawl}
                disabled={isCrawling}
              >
                {isCrawling ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin mr-1" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-1" />
                    Generate
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}
        
        {articles.length === 0 && !isLoading && !error && (
          <div className="text-center py-8 text-muted-foreground">
            <Bot className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No articles available yet.</p>
            {showCrawlButton && (
              <Button
                variant="outline"
                className="mt-3"
                onClick={handleCrawl}
                disabled={isCrawling}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Content
              </Button>
            )}
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
