
import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
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
        { id: '1', type: 'circle' as SearchResultType, title: 'Investment Circle', subtitle: '1.2k members' },
        { id: '2', type: 'category' as SearchResultType, title: 'Tax Planning', subtitle: '245 posts' },
        { id: '3', type: 'post' as SearchResultType, title: 'How to minimize tax liability', subtitle: 'by John Smith' },
        { id: '4', type: 'influencer' as SearchResultType, title: 'Jane Doe', subtitle: 'Financial Advisor', avatar: 'https://i.pravatar.cc/150?u=jane' },
        { id: '5', type: 'circle' as SearchResultType, title: 'Retirement Planning', subtitle: '3.4k members' },
        { id: '6', type: 'influencer' as SearchResultType, title: 'Mike Wilson', subtitle: 'Tax Expert', avatar: 'https://i.pravatar.cc/150?u=mike' },
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

  return (
    <div ref={searchRef} className={`relative ${expanded ? 'w-full' : ''}`}>
      <div className={`flex items-center gap-2 ${expanded ? 'bg-background border rounded-md shadow-sm px-3 py-2' : ''}`}>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
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
              className="flex-1 border-none shadow-none focus-visible:ring-0 pl-0"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </>
        )}
      </div>
      
      {expanded && (
        <div className={`absolute left-0 right-0 top-full mt-1 bg-background border rounded-md shadow-lg py-2 z-50 ${isMobile ? 'min-h-[60vh]' : ''}`}>
          <ScrollArea className={isMobile ? 'h-[60vh]' : 'max-h-[400px]'}>
            {searchResults.length > 0 ? (
              <div className="space-y-1">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="px-3 py-2 hover:bg-muted/50 cursor-pointer flex items-center gap-3"
                  >
                    {result.avatar ? (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={result.avatar} />
                        <AvatarFallback>{result.title.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs text-primary font-medium">
                          {result.type === 'circle' ? 'C' : 
                           result.type === 'category' ? '#' : 
                           result.type === 'post' ? 'P' : 'U'}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">{result.title}</p>
                      <p className="text-xs text-muted-foreground">{result.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchTerm ? (
              <div className="px-4 py-8 text-center">
                <p className="text-muted-foreground">No results found</p>
                <p className="text-xs text-muted-foreground mt-1">Try a different search term</p>
              </div>
            ) : (
              <div className="px-3 py-2">
                <h3 className="text-sm font-medium mb-2">Trending Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {trendingTopics.map((topic) => (
                    <div
                      key={topic.id}
                      className="px-2 py-1 bg-muted rounded-md text-xs cursor-pointer hover:bg-muted/70"
                    >
                      {topic.topic}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};
