
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bot, Loader2, Sparkles, DollarSign } from 'lucide-react';
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
          title: "Articles Crawled Successfully",
          description: (
            <div className="space-y-1">
              <p>{result.message}</p>
              {result.costOptimizations && (
                <div className="text-xs text-muted-foreground">
                  <p>• API calls used: {result.costOptimizations.apiCallsUsed}</p>
                  <p>• Duplicates filtered: {result.costOptimizations.duplicatesFiltered}</p>
                  <p>• Recent articles found: {result.costOptimizations.recentArticlesFound}</p>
                </div>
              )}
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
        description: "Failed to crawl articles. Please try again.",
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
          <Bot className="h-5 w-5 text-blue-500" />
          Cost-Optimized Gemini Crawler
          <DollarSign className="h-4 w-4 text-green-500" />
        </CardTitle>
        <CardDescription>
          AI-powered article discovery with intelligent cost optimization and duplicate detection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="topic">Topic</Label>
          <Input
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter topic to search for..."
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
                <SelectItem value="Financial">Financial</SelectItem>
                <SelectItem value="Markets">Markets</SelectItem>
                <SelectItem value="Cryptocurrency">Cryptocurrency</SelectItem>
                <SelectItem value="Real Estate">Real Estate</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="limit">Articles (Max 8)</Label>
            <Select value={limit.toString()} onValueChange={(value) => setLimit(parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 articles</SelectItem>
                <SelectItem value="5">5 articles</SelectItem>
                <SelectItem value="8">8 articles (max)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground bg-green-50 p-2 rounded">
          <p className="font-medium text-green-700">Cost Optimizations Active:</p>
          <ul className="list-disc list-inside space-y-1 text-green-600">
            <li>Single API call generates multiple articles</li>
            <li>Automatic duplicate detection (6-hour window)</li>
            <li>Intelligent rate limiting</li>
            <li>Batch database operations</li>
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
              Optimizing & Crawling...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Crawl Articles (Cost-Optimized)
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default GeminiCrawlerButton;
