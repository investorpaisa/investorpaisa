
import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  type: 'category' | 'post' | 'influencer' | 'circle';
  title: string;
  subtitle?: string;
  avatar?: string;
}

interface GeminiSearchProps {
  expanded?: boolean;
  onExpandToggle?: (expanded: boolean) => void;
  trendingTopics?: any[];
}

export function GeminiSearch({ expanded = false, onExpandToggle, trendingTopics = [] }: GeminiSearchProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Toggle search expansion
  const toggleExpanded = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    if (onExpandToggle) {
      onExpandToggle(newState);
    }
    if (newState && inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Close search
  const closeSearch = () => {
    setIsExpanded(false);
    setQuery('');
    setSearchResults([]);
    if (onExpandToggle) {
      onExpandToggle(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.length > 2) {
      performSearch(e.target.value);
    } else {
      setSearchResults([]);
    }
  };

  // Mock search function - replace with real API call
  const performSearch = (searchQuery: string) => {
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Mock results based on query
      const results: SearchResult[] = [
        {
          id: '1',
          type: 'category',
          title: 'Mutual Funds',
          subtitle: '245 posts'
        },
        {
          id: '2',
          type: 'category',
          title: 'Tax Planning',
          subtitle: '189 posts'
        },
        {
          id: '3',
          type: 'post',
          title: 'How to save taxes with ELSS investments',
          subtitle: 'Posted by Rahul Sharma'
        },
        {
          id: '4',
          type: 'influencer',
          title: 'Priya Mehta',
          subtitle: '@priya_finance',
          avatar: 'https://i.pravatar.cc/150?u=priya'
        },
        {
          id: '5',
          type: 'circle',
          title: 'Tax Saving Circle',
          subtitle: '1,245 members',
        }
      ].filter(result => 
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (result.subtitle && result.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      setSearchResults(results);
      setLoading(false);
    }, 300);
  };

  // Focus the input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    switch (result.type) {
      case 'category':
        navigate(`/category/${result.id}`);
        break;
      case 'post':
        navigate(`/post/${result.id}`);
        break;
      case 'influencer':
        navigate(`/profile/${result.id}`);
        break;
      case 'circle':
        navigate(`/circle/${result.id}`);
        break;
    }
    closeSearch();
  };

  return (
    <div className={`relative w-full ${isExpanded ? 'z-50' : ''}`}>
      <div className="relative max-w-4xl mx-auto">
        <div className={`flex items-center relative rounded-lg border bg-background ${isExpanded ? 'border-input' : 'border-muted'}`}>
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search for people, topics, and posts..."
            value={query}
            onChange={handleInputChange}
            className={`pl-9 focus-visible:ring-0 border-none shadow-none ${isExpanded ? '' : 'cursor-pointer'}`}
            onClick={toggleExpanded}
          />
          
          {isExpanded && query && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 h-7 w-7" 
              onClick={() => setQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {isExpanded && (
          <div className="absolute top-full left-0 right-0 mt-1 p-2 rounded-lg border bg-background shadow-md max-h-[80vh] overflow-hidden flex flex-col">
            {query.length > 0 ? (
              <>
                {loading ? (
                  <div className="py-10 text-center text-muted-foreground">Searching...</div>
                ) : (
                  <ScrollArea className="max-h-[60vh]">
                    {searchResults.length > 0 ? (
                      <div className="space-y-1 p-1">
                        {searchResults.map((result) => (
                          <div 
                            key={`${result.type}-${result.id}`}
                            className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer"
                            onClick={() => handleResultClick(result)}
                          >
                            {result.type === 'influencer' && result.avatar ? (
                              <div className="rounded-full h-10 w-10 overflow-hidden">
                                <img src={result.avatar} alt={result.title} className="h-full w-full object-cover" />
                              </div>
                            ) : (
                              <div className={`
                                h-10 w-10 flex items-center justify-center rounded-md
                                ${result.type === 'category' ? 'bg-blue-100 text-blue-500' : 
                                  result.type === 'post' ? 'bg-green-100 text-green-500' : 
                                  result.type === 'circle' ? 'bg-purple-100 text-purple-500' : 'bg-gray-100 text-gray-500'}
                              `}>
                                {result.type === 'category' ? '#' : 
                                 result.type === 'post' ? 'P' : 
                                 result.type === 'circle' ? 'C' : '@'}
                              </div>
                            )}
                            
                            <div>
                              <div className="font-medium">{result.title}</div>
                              <div className="text-xs text-muted-foreground flex items-center gap-2">
                                <Badge 
                                  variant="outline" 
                                  className={`
                                    text-[10px] py-0 h-4
                                    ${result.type === 'category' ? 'bg-blue-50 text-blue-500' : 
                                      result.type === 'post' ? 'bg-green-50 text-green-500' : 
                                      result.type === 'influencer' ? 'bg-orange-50 text-orange-500' : 
                                      'bg-purple-50 text-purple-500'}
                                  `}
                                >
                                  {result.type === 'category' ? 'Category' : 
                                   result.type === 'post' ? 'Post' : 
                                   result.type === 'influencer' ? 'Influencer' : 'Circle'}
                                </Badge>
                                <span>{result.subtitle}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-10 text-center text-muted-foreground">No results found</div>
                    )}
                  </ScrollArea>
                )}
              </>
            ) : (
              <div className="p-2">
                <h3 className="text-sm font-medium mb-2">Trending Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {trendingTopics?.slice(0, 8).map((topic, index) => (
                    <Badge 
                      key={index} 
                      variant="outline"
                      className="cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => {
                        setQuery(topic.topic);
                        performSearch(topic.topic);
                      }}
                    >
                      {topic.topic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="pt-3 mt-3 border-t flex justify-between">
              <div className="text-xs text-muted-foreground">
                Press ESC to close
              </div>
              <Button size="sm" variant="outline" onClick={closeSearch}>
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
