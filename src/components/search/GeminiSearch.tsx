
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, Hash, User, Newspaper, BarChart3, Bitcoin, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type SearchResultType = 'circle' | 'category' | 'post' | 'influencer' | 'news' | 'market';

interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  avatar?: string;
  category?: string;
}

interface TrendingTopic {
  id: number;
  topic: string;
  posts: number;
}

interface GeminiSearchProps {
  expanded: boolean;
  onExpandToggle: (expanded: boolean) => void;
  trendingTopics: TrendingTopic[];
}

export const GeminiSearch = ({ expanded, onExpandToggle, trendingTopics = [] }: GeminiSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [activeTab, setActiveTab] = useState('for-you');
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        onExpandToggle(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onExpandToggle]);

  useEffect(() => {
    if (expanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [expanded]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      // Mock search results - in real app, would fetch from API
      const results: SearchResult[] = [
        { id: '1', type: 'circle', title: 'Investment Circle', subtitle: '1.2k members', category: 'Investment' },
        { id: '2', type: 'category', title: 'Tax Planning', subtitle: '245 posts', category: 'Finance' },
        { id: '3', type: 'post', title: 'How to minimize tax liability', subtitle: 'by John Smith', category: 'Tax' },
        { id: '4', type: 'influencer', title: 'Jane Doe', subtitle: 'Financial Advisor', avatar: 'https://i.pravatar.cc/150?u=jane', category: 'Expert' },
        { id: '5', type: 'circle', title: 'Retirement Planning', subtitle: '3.4k members', category: 'Planning' },
        { id: '6', type: 'influencer', title: 'Mike Wilson', subtitle: 'Tax Expert', avatar: 'https://i.pravatar.cc/150?u=mike', category: 'Expert' },
        { id: '7', type: 'news', title: 'Budget 2023: Key Highlights', subtitle: 'Economic Times', category: 'Economy' },
        { id: '8', type: 'market', title: 'NIFTY 50', subtitle: '21,345.65 (+1.2%)', category: 'Index' },
      ];
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleToggleSearch = () => {
    onExpandToggle(!expanded);
  };

  const handleClear = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  const getIconForResultType = (type: SearchResultType) => {
    switch (type) {
      case 'circle':
        return <div className="h-8 w-8 rounded-full bg-black/5 flex items-center justify-center">
          <span className="text-xs text-black font-medium">C</span>
        </div>;
      case 'category':
        return <div className="h-8 w-8 rounded-full bg-black/5 flex items-center justify-center">
          <Hash className="h-4 w-4 text-black" />
        </div>;
      case 'post':
        return <div className="h-8 w-8 rounded-full bg-black/5 flex items-center justify-center">
          <span className="text-xs text-black font-medium">P</span>
        </div>;
      case 'news':
        return <div className="h-8 w-8 rounded-full bg-black/5 flex items-center justify-center">
          <Newspaper className="h-4 w-4 text-black" />
        </div>;
      case 'market':
        return <div className="h-8 w-8 rounded-full bg-black/5 flex items-center justify-center">
          <BarChart3 className="h-4 w-4 text-black" />
        </div>;
      default:
        return null;
    }
  };

  const getTrendingUsers = () => {
    return [
      { id: '1', name: 'Rahul Sharma', role: 'Financial Advisor', avatar: 'https://i.pravatar.cc/150?u=rahul', followers: '34.5k' },
      { id: '2', name: 'Priya Patel', role: 'Tax Consultant', avatar: 'https://i.pravatar.cc/150?u=priya', followers: '28.7k' },
      { id: '3', name: 'Vikram Malhotra', role: 'Investment Banker', avatar: 'https://i.pravatar.cc/150?u=vikram', followers: '19.3k' },
      { id: '4', name: 'Anjali Desai', role: 'Stock Market Analyst', avatar: 'https://i.pravatar.cc/150?u=anjali', followers: '15.8k' },
    ];
  };

  const getTrendingCategories = () => {
    return [
      { id: '1', name: 'Budget 2023', posts: 345 },
      { id: '2', name: 'Tax Planning', posts: 287 },
      { id: '3', name: 'Stock Market', posts: 234 },
      { id: '4', name: 'Cryptocurrency', posts: 189 },
      { id: '5', name: 'Mutual Funds', posts: 156 },
      { id: '6', name: 'Retirement Planning', posts: 132 },
    ];
  };

  const getTrendingMarkets = () => {
    return [
      { id: '1', name: 'NIFTY 50', value: '21,345.65', change: '+1.2%', status: 'up' },
      { id: '2', name: 'Sensex', value: '70,123.45', change: '+0.8%', status: 'up' },
      { id: '3', name: 'S&P 500', value: '5,064.23', change: '-0.3%', status: 'down' },
      { id: '4', name: 'Bitcoin', value: '$66,789.12', change: '+2.4%', status: 'up' },
      { id: '5', name: 'Ethereum', value: '$3,456.78', change: '+1.5%', status: 'up' },
    ];
  };

  const getTrendingNews = () => {
    return [
      { id: '1', title: 'Budget 2023: Key Highlights for Individual Taxpayers', source: 'Economic Times', time: '2 hours ago' },
      { id: '2', title: 'RBI Keeps Repo Rate Unchanged at 6.5% for Sixth Consecutive Time', source: 'Mint', time: '5 hours ago' },
      { id: '3', title: 'New Tax Regime: How to Calculate Your Tax Liability', source: 'Financial Express', time: '1 day ago' },
      { id: '4', title: 'Top 5 Mutual Funds to Invest in 2023', source: 'Business Standard', time: '2 days ago' },
    ];
  };

  return (
    <div 
      ref={searchRef} 
      className={`relative transition-all duration-300 ${expanded ? 'w-full' : ''}`}
    >
      <div 
        className={`flex items-center gap-2 transition-all duration-300 ${
          expanded 
            ? 'bg-white border rounded-lg shadow-md px-4 py-3' 
            : ''
        }`}
      >
        <Button
          variant="ghost"
          size="icon"
          className={`h-9 w-9 ${expanded ? 'text-gold' : ''}`}
          onClick={handleToggleSearch}
        >
          <Search className="h-4 w-4" />
        </Button>
        
        {expanded && (
          <>
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search investors, topics, posts, news or markets..."
              className="flex-1 border-none shadow-none focus-visible:ring-0 pl-0 bg-transparent"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-black/60"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </>
        )}
      </div>
      
      {expanded && (
        <div 
          className={`fixed inset-0 top-16 z-50 bg-white p-4 ${
            isMobile ? 'min-h-[calc(100vh-64px)]' : 'min-h-[min(90vh,800px)]'
          }`}
          style={{
            boxShadow: '0 -4px 50px rgba(0, 0, 0, 0.1)'
          }}
        >
          <ScrollArea className={isMobile ? 'h-[calc(100vh-80px)]' : 'max-h-[700px]'}>
            <div className="max-w-4xl mx-auto">
              {searchResults.length > 0 ? (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium mb-4 text-black">Search Results</h3>
                  
                  <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-5 h-auto mb-6">
                      <TabsTrigger value="for-you" className="py-2 data-[state=active]:text-gold data-[state=active]:border-b-2 data-[state=active]:border-gold rounded-none">
                        For You
                      </TabsTrigger>
                      <TabsTrigger value="users" className="py-2 data-[state=active]:text-gold data-[state=active]:border-b-2 data-[state=active]:border-gold rounded-none">
                        Users
                      </TabsTrigger>
                      <TabsTrigger value="posts" className="py-2 data-[state=active]:text-gold data-[state=active]:border-b-2 data-[state=active]:border-gold rounded-none">
                        Posts
                      </TabsTrigger>
                      <TabsTrigger value="news" className="py-2 data-[state=active]:text-gold data-[state=active]:border-b-2 data-[state=active]:border-gold rounded-none">
                        News
                      </TabsTrigger>
                      <TabsTrigger value="market" className="py-2 data-[state=active]:text-gold data-[state=active]:border-b-2 data-[state=active]:border-gold rounded-none">
                        Market
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="for-you" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {searchResults.map((result) => (
                          <div
                            key={result.id}
                            className="p-3 hover:bg-black/5 cursor-pointer flex items-center gap-3 rounded-md border border-black/10"
                          >
                            {result.avatar ? (
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={result.avatar} />
                                <AvatarFallback>{result.title.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                            ) : (
                              getIconForResultType(result.type)
                            )}
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-black">{result.title}</p>
                                {result.category && (
                                  <Badge variant="outline" className="bg-black/5 text-black/70 text-xs">
                                    {result.category}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-black/70">{result.subtitle}</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-black/40" />
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="users" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {searchResults.filter(r => r.type === 'influencer').map((result) => (
                          <div
                            key={result.id}
                            className="p-3 hover:bg-black/5 cursor-pointer flex items-center gap-3 rounded-md border border-black/10"
                          >
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={result.avatar} />
                              <AvatarFallback>{result.title.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-black">{result.title}</p>
                              <p className="text-xs text-black/70">{result.subtitle}</p>
                            </div>
                            <Button variant="outline" size="sm" className="text-xs h-8">Follow</Button>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="posts" className="space-y-4">
                      {searchResults.filter(r => r.type === 'post').map((result) => (
                        <div
                          key={result.id}
                          className="p-4 hover:bg-black/5 cursor-pointer rounded-md border border-black/10"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-gold/20 text-black border-0 hover:bg-gold/30">
                              {result.category}
                            </Badge>
                            <span className="text-xs text-black/50">• 2 hours ago</span>
                          </div>
                          <h4 className="text-base font-medium mb-1">{result.title}</h4>
                          <p className="text-sm text-black/70 mb-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel.</p>
                          <div className="flex items-center text-xs text-black/60">
                            <span>24 likes</span>
                            <span className="mx-2">•</span>
                            <span>12 comments</span>
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="news" className="space-y-4">
                      {searchResults.filter(r => r.type === 'news').map((result) => (
                        <div
                          key={result.id}
                          className="p-4 hover:bg-black/5 cursor-pointer rounded-md border border-black/10"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-black/10 text-black/70 border-0 hover:bg-black/20">
                              {result.category}
                            </Badge>
                            <span className="text-xs text-black/50">• 2 hours ago</span>
                          </div>
                          <h4 className="text-base font-medium mb-1">{result.title}</h4>
                          <p className="text-sm text-black/70 mb-1">{result.subtitle}</p>
                        </div>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="market" className="space-y-4">
                      {searchResults.filter(r => r.type === 'market').map((result) => (
                        <div
                          key={result.id}
                          className="p-4 hover:bg-black/5 cursor-pointer rounded-md border border-black/10 flex items-center justify-between"
                        >
                          <div>
                            <h4 className="text-base font-medium">{result.title}</h4>
                            <p className="text-sm text-black/70">{result.subtitle}</p>
                          </div>
                          <BarChart3 className="h-12 w-12 text-gold/40" />
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-medium text-black flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-gold" />
                        Trending Categories
                      </h3>
                      <Button variant="ghost" size="sm" className="text-gold text-xs">See All</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {getTrendingCategories().map((category) => (
                        <div
                          key={category.id}
                          className="px-3 py-1.5 bg-black/5 hover:bg-black/10 rounded-md text-xs font-medium cursor-pointer text-black transition-colors flex items-center gap-1"
                        >
                          {category.name}
                          <span className="text-gold/80 text-[10px]">{category.posts}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-medium text-black flex items-center gap-2">
                        <User className="h-4 w-4 text-gold" />
                        Trending Influencers
                      </h3>
                      <Button variant="ghost" size="sm" className="text-gold text-xs">See All</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {getTrendingUsers().map((user) => (
                        <div key={user.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-black/5 cursor-pointer">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-black/70">{user.role}</p>
                          </div>
                          <div className="text-xs text-gold font-medium">{user.followers}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-medium text-black flex items-center gap-2">
                        <Newspaper className="h-4 w-4 text-gold" />
                        Trending News
                      </h3>
                      <Button variant="ghost" size="sm" className="text-gold text-xs">See All</Button>
                    </div>
                    <div className="space-y-3">
                      {getTrendingNews().map((news) => (
                        <div key={news.id} className="p-3 border border-black/10 rounded-md hover:bg-black/5 cursor-pointer">
                          <h4 className="text-sm font-medium mb-1">{news.title}</h4>
                          <div className="flex items-center text-xs text-black/60">
                            <span>{news.source}</span>
                            <span className="mx-2">•</span>
                            <span>{news.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-medium text-black flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-gold" />
                        Market Trends
                      </h3>
                      <Button variant="ghost" size="sm" className="text-gold text-xs">See All</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {getTrendingMarkets().map((market) => (
                        <div key={market.id} className="p-3 border border-black/10 rounded-md hover:bg-black/5 cursor-pointer flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{market.name}</p>
                            <div className="flex items-center gap-1">
                              <span className="text-sm">{market.value}</span>
                              <span className={`text-xs ${market.status === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                {market.change}
                              </span>
                            </div>
                          </div>
                          <div className="h-8 w-16 flex items-end justify-end">
                            {/* Simple chart indication */}
                            <div className={`h-1 w-full rounded-full ${market.status === 'up' ? 'bg-green-600' : 'bg-red-600'}`}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};
