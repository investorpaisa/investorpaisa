
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Sparkles, RefreshCw } from 'lucide-react';
import { crawlArticlesWithGemini } from '@/services/news/geminiCrawlerService';
import { getLatestNews } from '@/services/news/newsService';
import { NewsArticle } from '@/types';
import NewsCard from '@/components/news/NewsCard';
import { useToast } from '@/hooks/use-toast';

const SearchNews = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load some initial trending articles
    const loadInitialContent = async () => {
      setIsLoading(true);
      try {
        const latestArticles = await getLatestNews(6);
        setArticles(latestArticles);
      } catch (error) {
        console.error('Error loading initial content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialContent();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    try {
      const result = await crawlArticlesWithGemini(
        searchTerm,
        5,
        'Search'
      );
      
      if (result.success) {
        setArticles(result.articles);
        toast({
          title: 'Search Complete',
          description: `Found ${result.articles.length} articles about "${searchTerm}"`,
        });
      } else {
        toast({
          title: 'Search Failed',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Search Error',
        description: 'Failed to search for articles. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search Financial News
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search for financial news topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button 
            onClick={handleSearch}
            disabled={isSearching || !searchTerm.trim()}
          >
            {isSearching ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                Searching...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Search
              </>
            )}
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="space-y-4">
            {articles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Enter a search term to find relevant financial articles</p>
              </div>
            ) : (
              <>
                <div className="text-sm text-muted-foreground">
                  {searchTerm ? `Search results for "${searchTerm}"` : 'Latest financial news'}
                </div>
                {articles.map((article) => (
                  <NewsCard
                    key={article.id}
                    article={article}
                    onBookmark={handleBookmark}
                    onShare={handleShare}
                  />
                ))}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchNews;
