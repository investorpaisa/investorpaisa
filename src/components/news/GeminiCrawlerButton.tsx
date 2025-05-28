
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Globe, Loader2, Rss, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
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
      console.log(`Starting crawl with topic: "${topic}", category: "${category}", limit: ${limit}`);
      
      const result = await crawlArticlesWithGemini(topic, limit, category);
      console.log('Crawl result:', result);
      
      if (result.success) {
        toast({
          title: "Real News Crawling Successful!",
          description: (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium">
                  Successfully crawled {result.articles.length} real articles
                </span>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Sources: {result.costOptimizations?.sourcesUsed?.join(', ') || 'Multiple RSS feeds'}</p>
                <p>• All articles have real URLs and content</p>
                <p>• Ready for user interactions (likes, comments, shares)</p>
                {result.costOptimizations?.duplicatesFiltered > 0 && (
                  <p>• Filtered out {result.costOptimizations.duplicatesFiltered} duplicate articles</p>
                )}
              </div>
            </div>
          ),
        });
      } else {
        console.error('Crawl failed:', result.message);
        toast({
          title: "Crawling Failed",
          description: (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span>{result.message}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Please check your internet connection and try again
              </p>
            </div>
          ),
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error during crawling:', error);
      toast({
        title: "Crawling Error",
        description: "Failed to crawl real articles. Please check your connection and try again.",
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
          Crawl real articles from RSS feeds and news sources including Bloomberg, Reuters, CNN, CNBC, Wall Street Journal, and more.
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
                <SelectItem value="Technology">Technology</SelectItem>
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
                <SelectItem value="15">15 articles</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground bg-green-50 p-3 rounded-lg">
          <p className="font-medium text-green-700 mb-2">Real News Sources Include:</p>
          <div className="grid grid-cols-2 gap-1 text-green-600">
            <ul className="list-disc list-inside space-y-1">
              <li>Bloomberg Markets</li>
              <li>Reuters Business</li>
              <li>CNN Money</li>
              <li>Wall Street Journal</li>
              <li>CNBC</li>
            </ul>
            <ul className="list-disc list-inside space-y-1">
              <li>MarketWatch</li>
              <li>Fortune</li>
              <li>Forbes</li>
              <li>CoinDesk (Crypto)</li>
              <li>TechCrunch (Tech)</li>
            </ul>
          </div>
          <p className="mt-2 text-green-600">
            ✓ Real article titles, summaries, and source URLs
            <br />
            ✓ Direct links to read full articles on source websites
            <br />
            ✓ Unique IDs for tracking user interactions
          </p>
        </div>
        
        <Button 
          onClick={handleCrawl} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Crawling Real Articles from {category} Sources...
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
