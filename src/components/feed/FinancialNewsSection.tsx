
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
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
          description: "Latest financial articles have been fetched.",
        });
      } else {
        console.error("Failed to refresh news:", result.message);
      }
    } catch (error) {
      console.error("Error refreshing news:", error);
    } finally {
      setIsRefreshingNews(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Financial News</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 gap-1"
            onClick={refreshNewsData}
            disabled={isRefreshingNews}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshingNews ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <CardDescription>Latest financial updates</CardDescription>
      </CardHeader>
      <CardContent>
        <NewsSection limit={limit} />
      </CardContent>
    </Card>
  );
};

export default FinancialNewsSection;
