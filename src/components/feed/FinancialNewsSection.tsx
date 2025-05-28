
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Rss } from 'lucide-react';
import NewsSection from '@/components/news/NewsSection';
import { triggerNewsFetch } from '@/services/news/newsService';
import { useToast } from '@/hooks/use-toast';

interface FinancialNewsSectionProps {
  limit?: number;
}

const FinancialNewsSection = ({ limit = 5 }: FinancialNewsSectionProps) => {
  const [isRefreshingNews, setIsRefreshingNews] = useState(false);
  const { toast } = useToast();

  const refreshNewsData = async () => {
    setIsRefreshingNews(true);
    try {
      const result = await triggerNewsFetch();
      if (result.success) {
        toast({
          title: "Financial News Updated",
          description: "Latest financial articles have been fetched from RSS feeds.",
        });
      } else {
        console.error("Failed to refresh news:", result.message);
        toast({
          title: "Refresh Failed",
          description: "Unable to fetch latest news. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error refreshing news:", error);
      toast({
        title: "Error",
        description: "Something went wrong while fetching news.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshingNews(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">Financial News</CardTitle>
              <Rss className="h-4 w-4 text-blue-500" />
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 gap-1"
              onClick={refreshNewsData}
              disabled={isRefreshingNews}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshingNews ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isRefreshingNews ? 'Loading...' : 'Refresh'}</span>
            </Button>
          </div>
          <CardDescription>Latest financial updates from trusted RSS sources</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <NewsSection limit={limit} />
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialNewsSection;
