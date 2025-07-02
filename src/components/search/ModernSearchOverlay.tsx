
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Search, X, TrendingUp, Users, FileText, Building, 
  Clock, ArrowRight, Sparkles, Zap, Star
} from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  id: string;
  type: 'profile' | 'post' | 'company' | 'trending';
  title: string;
  subtitle?: string;
  avatar?: string;
  badge?: string;
  verified?: boolean;
}

interface ModernSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModernSearchOverlay: React.FC<ModernSearchOverlayProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Market Analysis', 'Investment Strategy', 'Tech Stocks'
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock search data - in real app, this would come from API
  const mockResults: SearchResult[] = [
    {
      id: '1',
      type: 'profile',
      title: 'Rajesh Kumar',
      subtitle: 'Senior Financial Advisor at HDFC Bank',
      avatar: '/placeholder.svg',
      verified: true,
      badge: 'Expert'
    },
    {
      id: '2',
      type: 'profile',
      title: 'Priya Sharma',
      subtitle: 'Wealth Manager | CFP',
      avatar: '/placeholder.svg',
      badge: 'Premium'
    },
    {
      id: '3',
      type: 'post',
      title: 'Market Analysis: Nifty50 crosses 22,000',
      subtitle: 'Investment Strategy • 2 hours ago'
    },
    {
      id: '4',
      type: 'company',
      title: 'HDFC Bank',
      subtitle: 'Banking & Financial Services',
      avatar: '/placeholder.svg'
    },
    {
      id: '5',
      type: 'trending',
      title: '#TechStocks',
      subtitle: '12.5k posts this week'
    }
  ];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const filtered = mockResults.filter(result =>
          result.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          result.subtitle?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
        setResults(filtered);
        setIsLoading(false);
      }, 500);
    } else {
      setResults([]);
      setIsLoading(false);
    }
  }, [debouncedSearchTerm]);

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'profile': return Users;
      case 'post': return FileText;
      case 'company': return Building;
      case 'trending': return TrendingUp;
      default: return Search;
    }
  };

  const getResultColor = (type: string) => {
    switch (type) {
      case 'profile': return 'from-blue-500 to-purple-500';
      case 'post': return 'from-green-500 to-teal-500';
      case 'company': return 'from-orange-500 to-red-500';
      case 'trending': return 'from-pink-500 to-rose-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl h-[80vh] p-0 bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
        {/* Header with AI Gradient */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-white/70" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for people, posts, companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm text-lg"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/20 rounded-xl"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-12 w-12 p-0 text-white/70 hover:text-white hover:bg-white/20 rounded-2xl"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* AI Enhancement Badge */}
          <div className="relative mt-4 flex items-center justify-center">
            <Badge className="bg-white/20 text-white border-white/30 rounded-full px-4 py-1 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Enhanced Search
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {/* Search Results */}
          {searchTerm && (
            <div className="p-6 h-full overflow-y-auto">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center space-x-4 p-4 rounded-2xl bg-slate-50 animate-pulse">
                      <div className="h-12 w-12 bg-slate-200 rounded-2xl"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 mb-4">
                    <Zap className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-slate-900">Search Results</h3>
                    <Badge variant="secondary" className="rounded-full">
                      {results.length}
                    </Badge>
                  </div>
                  
                  <AnimatePresence>
                    {results.map((result, index) => {
                      const Icon = getResultIcon(result.type);
                      const colorClass = getResultColor(result.type);
                      
                      return (
                        <motion.div
                          key={result.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.1 }}
                          className="group cursor-pointer"
                        >
                          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white border border-slate-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300 hover:-translate-y-1">
                            <div className={`h-12 w-12 bg-gradient-to-r ${colorClass} rounded-2xl flex items-center justify-center shadow-lg`}>
                              {result.avatar ? (
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src={result.avatar} />
                                  <AvatarFallback>
                                    <Icon className="h-6 w-6 text-white" />
                                  </AvatarFallback>
                                </Avatar>
                              ) : (
                                <Icon className="h-6 w-6 text-white" />
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-semibold text-slate-900 truncate">{result.title}</h4>
                                {result.verified && (
                                  <Star className="h-4 w-4 text-blue-600" />
                                )}
                                {result.badge && (
                                  <Badge variant="secondary" className="rounded-full text-xs">
                                    {result.badge}
                                  </Badge>
                                )}
                              </div>
                              {result.subtitle && (
                                <p className="text-sm text-slate-600 truncate">{result.subtitle}</p>
                              )}
                            </div>
                            
                            <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="h-24 w-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <Search className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No results found</h3>
                  <p className="text-slate-600">Try searching for people, posts, or companies</p>
                </div>
              )}
            </div>
          )}

          {/* Recent Searches & Suggestions */}
          {!searchTerm && (
            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="h-5 w-5 text-slate-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Recent</h3>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchTerm(search)}
                      className="flex items-center space-x-3 w-full p-3 rounded-2xl hover:bg-slate-50 transition-colors text-left"
                    >
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-700">{search}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-slate-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Trending</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {['Market Analysis', 'Tech Stocks', 'Investment Tips', 'Portfolio Review'].map((trend, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchTerm(trend)}
                      className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all duration-200 text-left border border-blue-100"
                    >
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-slate-900">{trend}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
