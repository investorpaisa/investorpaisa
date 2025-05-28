
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Globe, Loader2, Rss, ExternalLink } from 'lucide-react';
import { crawlArticlesWithGemini } from '@/services/news/geminiCrawlerService';
import { useToast } from '@/hooks/use-toast';

const GeminiCrawlerButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState('financial news');
  const [category, setCategory] = useState('Business');
  const [limit, setLimit] = useState(5);
  const { toast } = useToast();

  const handleCrawl = async () => {
    setIsLoading(true);
    try {
      const result = await crawlArticlesWithGemini(topic, limit, category);
      
      if (result.success) {
        toast({
          title: "Real News Crawling Successful",
          description: (
            <div className="space-y-1">
              <p>Successfully crawled {result.articles.length} real articles from RSS feeds and news sources</p>
              <div className="text-xs text-muted-foreground">
                <p>• Real articles with source URLs</p>
                <p>• Unique IDs for tracking interactions</p>
                <p>• Images and summaries included</p>
              </div>
            </div>
          ),
        });
      } else {
        toast({
          title: "Crawling Failed",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to crawl real articles. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-500" />
          Real News Crawler
          <Rss className="h-4 w-4 text-green-500" />
        </CardTitle>
        <CardDescription>
          Crawl real articles from RSS feeds and news sources. Each article includes title, summary, image, and direct link to the original source.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="topic">Search Topic/Tag</Label>
          <Input
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter topic to search real articles for..."
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Economy">Economy</SelectItem>
                <SelectItem value="Markets">Markets</SelectItem>
                <SelectItem value="Cryptocurrency">Cryptocurrency</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="limit">Articles to Crawl</Label>
            <Select value={limit.toString()} onValueChange={(value) => setLimit(parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 articles</SelectItem>
                <SelectItem value="5">5 articles</SelectItem>
                <SelectItem value="8">8 articles</SelectItem>
                <SelectItem value="10">10 articles</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground bg-green-50 p-2 rounded">
          <p className="font-medium text-green-700">Real News Sources:</p>
          <ul className="list-disc list-inside space-y-1 text-green-600">
            <li>RSS feeds from Bloomberg, Reuters, CNN Money</li>
            <li>Real article titles, summaries, and source URLs</li>
            <li>Original publication images when available</li>
            <li>Direct links to read full articles on source websites</li>
          </ul>
        </div>
        
        <Button 
          onClick={handleCrawl} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Crawling Real Articles...
            </>
          ) : (
            <>
              <Globe className="mr-2 h-4 w-4" />
              Crawl Real Articles
              <ExternalLink className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default GeminiCrawlerButton;
