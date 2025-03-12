
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export type SearchResultType = 'circle' | 'category' | 'post' | 'influencer' | 'news' | 'market';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  avatar?: string;
  category?: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SearchResults = ({ results, activeTab, setActiveTab }: SearchResultsProps) => {
  const getIconForResultType = (type: SearchResultType) => {
    switch (type) {
      case 'circle':
        return <div className="h-8 w-8 rounded-full bg-black/5 flex items-center justify-center">
          <span className="text-xs text-black font-medium">C</span>
        </div>;
      case 'category':
        return <div className="h-8 w-8 rounded-full bg-black/5 flex items-center justify-center">
          <span className="text-xs text-black font-medium">#</span>
        </div>;
      case 'post':
        return <div className="h-8 w-8 rounded-full bg-black/5 flex items-center justify-center">
          <span className="text-xs text-black font-medium">P</span>
        </div>;
      case 'news':
        return <div className="h-8 w-8 rounded-full bg-black/5 flex items-center justify-center">
          <span className="text-xs text-black font-medium">N</span>
        </div>;
      case 'market':
        return <div className="h-8 w-8 rounded-full bg-black/5 flex items-center justify-center">
          <span className="text-xs text-black font-medium">M</span>
        </div>;
      default:
        return null;
    }
  };

  return (
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
            {results.map((result) => (
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
            {results.filter(r => r.type === 'influencer').map((result) => (
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
          {results.filter(r => r.type === 'post').map((result) => (
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
          {results.filter(r => r.type === 'news').map((result) => (
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
          {results.filter(r => r.type === 'market').map((result) => (
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
  );
};

export default SearchResults;
