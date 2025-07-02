
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Search, X, TrendingUp, Users, FileText, Building,
  Sparkles, Clock, ArrowRight, Hash, Zap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchResult {
  type: 'user' | 'post' | 'company' | 'hashtag';
  id: string;
  title: string;
  subtitle?: string;
  avatar?: string;
  verified?: boolean;
  premium?: boolean;
  relevanceScore?: number;
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AISearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
      loadRecentSearches();
    }
  }, [isOpen]);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      performSearch(debouncedQuery);
    } else {
      setResults([]);
      generateSuggestions();
    }
  }, [debouncedQuery]);

  const loadRecentSearches = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_searches')
        .select('search_query')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentSearches(data.map(item => item.search_query));
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const saveSearchQuery = async (searchQuery: string) => {
    if (!user || !searchQuery.trim()) return;

    try {
      await supabase
        .from('user_searches')
        .insert({
          user_id: user.id,
          search_query: searchQuery,
          search_type: 'general'
        });
    } catch (error) {
      console.error('Error saving search query:', error);
    }
  };

  const generateSuggestions = () => {
    const trendingSuggestions = [
      "Market Analysis",
      "Investment Tips",
      "Stock Recommendations",
      "Crypto Updates",
      "Portfolio Management",
      "Financial Planning",
      "Trading Strategies",
      "Market Trends"
    ];
    setSuggestions(trendingSuggestions.slice(0, 4));
  };

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      const searchResults: SearchResult[] = [];

      // Search users
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url, headline, is_verified, premium_member')
        .textSearch('search_vector', searchQuery.replace(/\s+/g, ' & '))
        .limit(5);

      if (!usersError && users) {
        searchResults.push(...users.map(user => ({
          type: 'user' as const,
          id: user.id,
          title: user.full_name || user.username || 'Unknown User',
          subtitle: user.headline || user.username,
          avatar: user.avatar_url,
          verified: user.is_verified,
          premium: user.premium_member,
          relevanceScore: 1
        })));
      }

      // Search posts
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select(`
          id, title, content,
          profiles:user_id (full_name, avatar_url)
        `)
        .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
        .limit(8);

      if (!postsError && posts) {
        searchResults.push(...posts.map(post => ({
          type: 'post' as const,
          id: post.id,
          title: post.title,
          subtitle: `by ${post.profiles?.full_name || 'Unknown'} • ${post.content.substring(0, 60)}...`,
          avatar: post.profiles?.avatar_url,
          relevanceScore: 0.8
        })));
      }

      // Add hashtag suggestions
      if (searchQuery.startsWith('#') || searchQuery.includes('#')) {
        const hashtag = searchQuery.replace('#', '');
        searchResults.push({
          type: 'hashtag',
          id: hashtag,
          title: `#${hashtag}`,
          subtitle: 'Explore posts with this hashtag',
          relevanceScore: 0.9
        });
      }

      // Sort by relevance score
      searchResults.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
      
      setResults(searchResults);
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      handleResultClick(results[selectedIndex]);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    saveSearchQuery(query);
    setQuery('');
    onClose();
    
    // Navigate based on result type
    switch (result.type) {
      case 'user':
        window.location.href = `/profile/${result.id}`;
        break;
      case 'post':
        // Navigate to post detail or scroll to post
        break;
      case 'hashtag':
        // Navigate to hashtag feed
        break;
      default:
        break;
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'user': return <Users className="h-5 w-5 text-blue-500" />;
      case 'post': return <FileText className="h-5 w-5 text-green-500" />;
      case 'company': return <Building className="h-5 w-5 text-purple-500" />;
      case 'hashtag': return <Hash className="h-5 w-5 text-orange-500" />;
      default: return <Search className="h-5 w-5 text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 pt-20">
        <Card className="max-w-2xl mx-auto rounded-3xl shadow-2xl border-0 overflow-hidden bg-white/95 backdrop-blur-md">
          
          {/* Search Header */}
          <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-blue-500 animate-pulse" />
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <Input
                  ref={searchInputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search people, posts, companies..."
                  className="pl-16 pr-4 py-4 text-lg border-0 bg-white/70 rounded-2xl focus-visible:ring-2 focus-visible:ring-blue-500 placeholder:text-slate-400"
                />
                {loading && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-12 w-12 rounded-2xl hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Search Content */}
          <div className="max-h-96 overflow-y-auto">
            {query.trim() === '' ? (
              <div className="p-6 space-y-6">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-600 mb-3 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Recent searches
                    </h3>
                    <div className="space-y-1">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => setQuery(search)}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 text-sm transition-colors"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Suggestions */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-600 mb-3 flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-purple-500" />
                    Trending in Finance
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(suggestion)}
                        className="p-3 text-left rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700">{suggestion}</span>
                          <TrendingUp className="h-4 w-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-2">
                {results.length === 0 && !loading ? (
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No results found for "{query}"</p>
                    <p className="text-sm text-slate-400 mt-1">Try adjusting your search terms</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {results.map((result, index) => (
                      <button
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleResultClick(result)}
                        className={`w-full text-left p-4 rounded-2xl transition-all group ${
                          selectedIndex === index 
                            ? 'bg-blue-50 border border-blue-200 shadow-sm' 
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {result.avatar ? (
                            <Avatar className="h-10 w-10 ring-2 ring-white">
                              <AvatarImage src={result.avatar} />
                              <AvatarFallback className="bg-blue-600 text-white text-sm">
                                {result.title.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                              {getResultIcon(result.type)}
                            </div>
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-slate-900 truncate">{result.title}</h4>
                              {result.verified && (
                                <TrendingUp className="h-4 w-4 text-blue-500 flex-shrink-0" />
                              )}
                              {result.premium && (
                                <Badge className="bg-yellow-100 text-yellow-800 text-xs rounded-lg">
                                  Premium
                                </Badge>
                              )}
                            </div>
                            {result.subtitle && (
                              <p className="text-sm text-slate-500 truncate">{result.subtitle}</p>
                            )}
                          </div>
                          
                          <ArrowRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
