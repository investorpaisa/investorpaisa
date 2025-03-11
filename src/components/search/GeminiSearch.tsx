
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Sparkles, TrendingUp, Users, User, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import TrendingTopics from '@/components/feed/TrendingTopics';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

interface GeminiSearchProps {
  expanded: boolean;
  onExpandToggle: (expanded: boolean) => void;
  trendingTopics: any[];
}

export const GeminiSearch = ({ expanded, onExpandToggle, trendingTopics }: GeminiSearchProps) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const [searchSuggestions] = useState([
    { title: 'Mutual Fund Returns', category: 'Investment' },
    { title: 'Tax Saving Strategies', category: 'Tax Planning' },
    { title: 'Stock Market Analysis', category: 'Markets' },
    { title: 'Retirement Planning', category: 'Personal Finance' },
  ]);
  
  const [recentSearches] = useState([
    { type: 'user', name: 'Rajan Mehta', username: '@rajan_investor', avatar: '/placeholder.svg' },
    { type: 'circle', name: 'Stock Market Experts', members: 1245, avatar: '/placeholder.svg' },
    { type: 'topic', name: 'Dividend Investing', posts: 564 },
  ]);

  useEffect(() => {
    if (expanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [expanded]);

  const handleExpand = () => {
    onExpandToggle(true);
  };

  const handleCollapse = () => {
    onExpandToggle(false);
    setQuery('');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would search and navigate to results
    console.log('Searching for:', query);
  };

  return (
    <div className={`w-full ${isMobile ? 'px-2' : ''}`}>
      <AnimatePresence>
        {!expanded ? (
          <motion.div 
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            <div 
              className="h-12 px-4 border rounded-full flex items-center cursor-pointer bg-white shadow-sm hover:shadow-md transition-shadow"
              onClick={handleExpand}
            >
              <Search className="w-5 h-5 text-muted-foreground mr-2" />
              <span className="text-muted-foreground text-sm truncate">Search financial topics, news, or stocks...</span>
              <div className="ml-auto flex items-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mr-1">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mr-1">AI</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-background z-50 pb-4 overflow-auto"
            style={{ top: 0 }}
          >
            <div className="max-w-6xl mx-auto px-4 py-4">
              <form onSubmit={handleSearch}>
                <div className="flex items-center mb-6">
                  <div className="relative flex-1">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Search className="h-5 w-5" />
                    </div>
                    <Input
                      ref={inputRef}
                      type="text"
                      placeholder="Search with AI assistance..."
                      className="w-full h-12 pl-10 pr-12 rounded-full text-base focus-visible:ring-gold focus-visible:ring-offset-2 border-gray-300 shadow-sm"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    {query && (
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        onClick={() => setQuery('')}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-2"
                    onClick={handleCollapse}
                  >
                    Cancel
                  </Button>
                </div>
              </form>

              <div className="max-w-4xl mx-auto">
                {/* Recent Searches */}
                <div className="mb-8">
                  <h3 className="font-medium text-lg mb-4 flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-gold" />
                    Recent Searches
                  </h3>
                  <div className="space-y-3">
                    {recentSearches.map((item, index) => (
                      <div 
                        key={index} 
                        className="flex items-center p-3 border rounded-xl hover:bg-muted/30 cursor-pointer transition-colors"
                      >
                        {item.type === 'user' ? (
                          <>
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src={item.avatar} alt={item.name} />
                              <AvatarFallback>{item.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center">
                                <h4 className="font-medium">{item.name}</h4>
                                <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700">User</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">{item.username}</p>
                            </div>
                          </>
                        ) : item.type === 'circle' ? (
                          <>
                            <div className="h-10 w-10 rounded-full bg-gold/20 flex items-center justify-center mr-3">
                              <Users className="h-5 w-5 text-gold" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center">
                                <h4 className="font-medium">{item.name}</h4>
                                <Badge variant="outline" className="ml-2 bg-purple-50 text-purple-700">Circle</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">{item.members} members</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                              <TrendingUp className="h-5 w-5 text-blue-500" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center">
                                <h4 className="font-medium">{item.name}</h4>
                                <Badge variant="outline" className="ml-2 bg-green-50 text-green-700">Topic</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">{item.posts} posts</p>
                            </div>
                          </>
                        )}
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="font-medium text-lg mb-4 flex items-center">
                    <Sparkles className="mr-2 h-5 w-5 text-gold" />
                    Suggested Searches
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {searchSuggestions.map((suggestion, index) => (
                      <Card 
                        key={index} 
                        className="cursor-pointer hover:shadow-md transition-shadow border-gold/10 hover:border-gold/30"
                        onClick={() => setQuery(suggestion.title)}
                      >
                        <CardContent className="flex items-start p-4">
                          <div className="mr-3 mt-1 w-8 h-8 rounded-full bg-gradient-to-r from-gold/60 to-gold flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium">{suggestion.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{suggestion.category}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-lg mb-4 flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-gold" />
                    Trending Topics
                  </h3>
                  <TrendingTopics topics={trendingTopics} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
