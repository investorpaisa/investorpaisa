
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Search, X, TrendingUp, Users, FileText, 
  Building, Hash, Sparkles, ArrowRight
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SearchResult {
  id: string;
  type: 'profile' | 'post' | 'company' | 'topic';
  title: string;
  subtitle?: string;
  description?: string;
  avatar?: string;
  verified?: boolean;
  category?: string;
  data?: any;
}

interface ModernSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModernSearchOverlay = ({ isOpen, onClose }: ModernSearchOverlayProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions] = useState([
    'Tax Planning', 'Mutual Funds', 'Stock Market', 'Investment Strategies',
    'Retirement Planning', 'Personal Finance', 'Cryptocurrency', 'Real Estate'
  ]);

  useEffect(() => {
    const loadRecentSearches = () => {
      const recent = localStorage.getItem('recentSearches');
      if (recent) {
        setRecentSearches(JSON.parse(recent));
      }
    };
    
    if (isOpen) {
      loadRecentSearches();
    }
  }, [isOpen]);

  useEffect(() => {
    const performSearch = async () => {
      if (!searchTerm.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const searchResults: SearchResult[] = [];

        // Search profiles
        const { data: profiles } = await supabase
          .from('profiles')
          .select('*')
          .or(`full_name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%,headline.ilike.%${searchTerm}%,bio.ilike.%${searchTerm}%`)
          .limit(5);

        if (profiles) {
          profiles.forEach(profile => {
            searchResults.push({
              id: profile.id,
              type: 'profile',
              title: profile.full_name || profile.username || 'Unknown User',
              subtitle: profile.headline || 'Professional',
              description: profile.bio,
              avatar: profile.avatar_url,
              verified: profile.is_verified,
              data: profile
            });
          });
        }

        // Search posts
        const { data: posts } = await supabase
          .from('posts')
          .select(`
            *,
            profiles!posts_user_id_fkey(full_name, username, avatar_url)
          `)
          .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
          .limit(5);

        if (posts) {
          posts.forEach(post => {
            searchResults.push({
              id: post.id,
              type: 'post',
              title: post.title,
              subtitle: `by ${post.profiles?.full_name || post.profiles?.username || 'Unknown'}`,
              description: post.content?.substring(0, 100) + '...',
              category: 'Post',
              data: post
            });
          });
        }

        // Search companies
        const { data: companies } = await supabase
          .from('companies')
          .select('*')
          .or(`name.ilike.%${searchTerm}%,industry.ilike.%${searchTerm}%`)
          .limit(3);

        if (companies) {
          companies.forEach(company => {
            searchResults.push({
              id: company.id,
              type: 'company',
              title: company.name,
              subtitle: company.industry || 'Company',
              description: company.description,
              avatar: company.logo_url,
              category: 'Company',
              data: company
            });
          });
        }

        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        toast.error('Search failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleResultClick = (result: SearchResult) => {
    // Save to recent searches
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));

    if (result.type === 'profile') {
      navigate(`/profile/${result.id}`);
    } else if (result.type === 'post') {
      // Handle post navigation
      navigate('/professional');
    }
    
    onClose();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'profile': return Users;
      case 'post': return FileText;
      case 'company': return Building;
      case 'topic': return Hash;
      default: return Search;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] p-0 border-0 shadow-2xl bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden">
        {/* Search Header */}
        <div className="p-6 border-b border-slate-200/50 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for people, posts, companies..."
              className="pl-12 pr-12 h-14 text-lg border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              autoFocus
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                <X className="h-5 w-5 text-slate-400 hover:text-slate-600" />
              </button>
            )}
          </div>
        </div>

        {/* Search Content */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600">Searching with AI intelligence...</p>
            </div>
          ) : searchTerm ? (
            results.length > 0 ? (
              <div className="p-4">
                <div className="space-y-2">
                  {results.map((result) => {
                    const IconComponent = getResultIcon(result.type);
                    return (
                      <button
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleResultClick(result)}
                        className="w-full p-4 rounded-2xl hover:bg-slate-50 transition-colors duration-200 text-left group"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            {result.type === 'profile' ? (
                              <Avatar className="h-12 w-12 ring-2 ring-blue-100">
                                <AvatarImage src={result.avatar} />
                                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold">
                                  {result.title.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            ) : (
                              <div className="h-12 w-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                                <IconComponent className="h-6 w-6 text-blue-600" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                                {result.title}
                              </h3>
                              {result.verified && (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs rounded-full">
                                  Verified
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs rounded-full">
                                {result.type}
                              </Badge>
                            </div>
                            {result.subtitle && (
                              <p className="text-slate-600 text-sm mt-1">{result.subtitle}</p>
                            )}
                            {result.description && (
                              <p className="text-slate-500 text-sm mt-1 line-clamp-2">{result.description}</p>
                            )}
                          </div>
                          <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No results found</h3>
                <p className="text-slate-600">Try adjusting your search terms or browse suggestions below</p>
              </div>
            )
          ) : (
            <div className="p-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Recent Searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setSearchTerm(search)}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-2xl text-sm text-slate-700 transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Suggestions */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-purple-600" />
                  AI Suggestions
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-2xl text-left transition-all duration-200 group"
                    >
                      <div className="flex items-center space-x-2">
                        <Hash className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-slate-900 group-hover:text-blue-600">
                          {suggestion}
                        </span>
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
