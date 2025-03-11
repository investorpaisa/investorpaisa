
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Sparkles, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import TrendingTopics from '@/components/feed/TrendingTopics';

interface GeminiSearchProps {
  expanded: boolean;
  onExpandToggle: (expanded: boolean) => void;
  trendingTopics: any[];
}

export const GeminiSearch = ({ expanded, onExpandToggle, trendingTopics }: GeminiSearchProps) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchSuggestions] = useState([
    { title: 'Mutual Fund Returns', category: 'Investment' },
    { title: 'Tax Saving Strategies', category: 'Tax Planning' },
    { title: 'Stock Market Analysis', category: 'Markets' },
    { title: 'Retirement Planning', category: 'Personal Finance' },
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
    <div className="w-full">
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
              <span className="text-muted-foreground text-sm">Search financial topics, news, or stocks...</span>
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
                      className="w-full h-12 pl-10 pr-12 rounded-full text-base focus-visible:ring-blue-500 focus-visible:ring-offset-2 border-gray-300 shadow-sm"
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
                <div className="mb-8">
                  <h3 className="font-medium text-lg mb-4 flex items-center">
                    <Sparkles className="mr-2 h-5 w-5 text-blue-500" />
                    Suggested Searches
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {searchSuggestions.map((suggestion, index) => (
                      <Card 
                        key={index} 
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setQuery(suggestion.title)}
                      >
                        <CardContent className="flex items-start p-4">
                          <div className="mr-3 mt-1 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
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
                    <TrendingUp className="mr-2 h-5 w-5 text-blue-500" />
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
