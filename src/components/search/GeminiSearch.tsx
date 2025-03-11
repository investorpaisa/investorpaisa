
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, Hash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';

type SearchResultType = 'circle' | 'category' | 'post' | 'influencer';

interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  avatar?: string;
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
      // Mock search results
      const results: SearchResult[] = [
        { id: '1', type: 'circle', title: 'Investment Circle', subtitle: '1.2k members' },
        { id: '2', type: 'category', title: 'Tax Planning', subtitle: '245 posts' },
        { id: '3', type: 'post', title: 'How to minimize tax liability', subtitle: 'by John Smith' },
        { id: '4', type: 'influencer', title: 'Jane Doe', subtitle: 'Financial Advisor', avatar: 'https://i.pravatar.cc/150?u=jane' },
        { id: '5', type: 'circle', title: 'Retirement Planning', subtitle: '3.4k members' },
        { id: '6', type: 'influencer', title: 'Mike Wilson', subtitle: 'Tax Expert', avatar: 'https://i.pravatar.cc/150?u=mike' },
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
        return <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
          <span className="text-xs text-purple-600 font-medium">C</span>
        </div>;
      case 'category':
        return <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
          <Hash className="h-4 w-4 text-blue-600" />
        </div>;
      case 'post':
        return <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
          <span className="text-xs text-green-600 font-medium">P</span>
        </div>;
      default:
        return null;
    }
  };

  return (
    <div 
      ref={searchRef} 
      className={`relative transition-all duration-300 ${expanded ? 'w-full' : ''}`}
    >
      <div 
        className={`flex items-center gap-2 transition-all duration-300 ${
          expanded 
            ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border rounded-lg shadow-md px-4 py-3' 
            : ''
        }`}
      >
        <Button
          variant="ghost"
          size="icon"
          className={`h-9 w-9 ${expanded ? 'text-purple-600' : ''}`}
          onClick={handleToggleSearch}
        >
          <Search className="h-4 w-4" />
        </Button>
        
        {expanded && (
          <>
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search investors, topics, or posts..."
              className="flex-1 border-none shadow-none focus-visible:ring-0 pl-0 bg-transparent"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-purple-600"
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
          className={`absolute left-0 right-0 top-full mt-1 bg-white border border-purple-100 rounded-lg shadow-lg py-3 z-50 ${
            isMobile ? 'min-h-[60vh]' : ''
          }`}
          style={{
            backgroundImage: 'linear-gradient(to top, #accbee 0%, #e7f0fd 100%)',
            backgroundSize: '100%',
            backgroundPosition: 'bottom'
          }}
        >
          <ScrollArea className={isMobile ? 'h-[60vh]' : 'max-h-[400px]'}>
            {searchResults.length > 0 ? (
              <div className="space-y-1 px-1">
                <h3 className="text-sm font-medium mb-2 px-3 text-purple-900">Search Results</h3>
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="px-3 py-2 hover:bg-purple-50/70 cursor-pointer flex items-center gap-3 rounded-md mx-1"
                  >
                    {result.avatar ? (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={result.avatar} />
                        <AvatarFallback>{result.title.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                    ) : (
                      getIconForResultType(result.type)
                    )}
                    <div>
                      <p className="text-sm font-medium text-purple-900">{result.title}</p>
                      <p className="text-xs text-purple-700/70">{result.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchTerm ? (
              <div className="px-4 py-8 text-center">
                <p className="text-purple-900">No results found</p>
                <p className="text-xs text-purple-700 mt-1">Try a different search term</p>
              </div>
            ) : (
              <div className="px-3 py-2">
                <h3 className="text-sm font-medium mb-3 text-purple-900 flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  Trending Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {trendingTopics.map((topic) => (
                    <div
                      key={topic.id}
                      className="px-3 py-1.5 bg-purple-100/70 hover:bg-purple-200/80 rounded-md text-xs font-medium cursor-pointer text-purple-800 transition-colors"
                    >
                      {topic.topic}
                      <span className="ml-1.5 text-purple-600/70 text-[10px]">{topic.posts}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5">
                  <h3 className="text-sm font-medium mb-2 text-purple-900">Quick Searches</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-md border border-purple-200 p-2 hover:bg-purple-50/50 cursor-pointer">
                      <p className="text-xs font-medium text-purple-900">Financial Advisors</p>
                      <p className="text-[10px] text-purple-700/70">Find top experts</p>
                    </div>
                    <div className="rounded-md border border-purple-200 p-2 hover:bg-purple-50/50 cursor-pointer">
                      <p className="text-xs font-medium text-purple-900">Investment Tips</p>
                      <p className="text-[10px] text-purple-700/70">Latest strategies</p>
                    </div>
                    <div className="rounded-md border border-purple-200 p-2 hover:bg-purple-50/50 cursor-pointer">
                      <p className="text-xs font-medium text-purple-900">Tax Planning</p>
                      <p className="text-[10px] text-purple-700/70">Reduce your tax burden</p>
                    </div>
                    <div className="rounded-md border border-purple-200 p-2 hover:bg-purple-50/50 cursor-pointer">
                      <p className="text-xs font-medium text-purple-900">Budget 2023</p>
                      <p className="text-[10px] text-purple-700/70">Policy changes & impact</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};
