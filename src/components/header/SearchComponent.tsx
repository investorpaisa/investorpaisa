
import React, { useState, useRef, useEffect } from 'react';
import { Search, X, TrendingUp, Users, FileText } from 'lucide-react';
import { SystemInput, SystemCard, Typography, SystemIconButton } from '@/components/ui/design-system';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  id: string;
  type: 'user' | 'post' | 'trending';
  title: string;
  subtitle?: string;
  avatar?: string;
}

const mockSearchResults: SearchResult[] = [
  { id: '1', type: 'user', title: 'Moksha Sharma', subtitle: '@moksha_trader', avatar: '' },
  { id: '2', type: 'post', title: 'Market Analysis: Tech Stocks Rally', subtitle: '2 hours ago' },
  { id: '3', type: 'trending', title: '#TechStocks', subtitle: '12.5k posts' },
  { id: '4', type: 'user', title: 'Investment Expert', subtitle: '@expert_trader', avatar: '' },
];

export const SearchComponent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = mockSearchResults.filter(result =>
        result.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [searchTerm]);

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'user': return Users;
      case 'post': return FileText;
      case 'trending': return TrendingUp;
      default: return Search;
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <SystemIconButton
          icon={Search}
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          className="relative"
        />
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 top-full mt-2 w-96 z-50"
            >
              <SystemCard variant="elevated" className="p-4 bg-black/95 backdrop-blur-xl border border-white/20">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search users, posts, trends..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-black/60 border border-white/20 rounded-xl text-white placeholder-white/40 focus:border-gold focus:outline-none backdrop-blur-sm"
                    autoFocus
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <X className="h-4 w-4 text-white/40 hover:text-white" />
                    </button>
                  )}
                </div>

                {results.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {results.map((result) => {
                      const Icon = getResultIcon(result.type);
                      return (
                        <motion.div
                          key={result.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-gold" />
                          </div>
                          <div className="flex-1">
                            <Typography.Body className="text-sm font-medium text-white">
                              {result.title}
                            </Typography.Body>
                            {result.subtitle && (
                              <Typography.Small className="text-white/60">{result.subtitle}</Typography.Small>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {searchTerm && results.length === 0 && (
                  <div className="mt-4 text-center py-8">
                    <Typography.Small className="text-white/60">No results found for "{searchTerm}"</Typography.Small>
                  </div>
                )}
              </SystemCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
