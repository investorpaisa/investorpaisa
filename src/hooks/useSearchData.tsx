
import { useState, useEffect } from 'react';
import { SearchResult } from '@/components/search/SearchResults';
import { getLatestNews } from '@/services/news/newsService';
import { NewsArticle } from '@/types';

export const useSearchData = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [activeTab, setActiveTab] = useState('for-you');

  useEffect(() => {
    const performSearch = async () => {
      if (searchTerm.trim()) {
        try {
          // Search across different content types
          const newsResults = await getLatestNews(5);
          
          // Convert news articles to search results
          const newsSearchResults: SearchResult[] = newsResults.map(article => ({
            id: article.id,
            type: 'news' as const,
            title: article.title,
            subtitle: article.source || 'News',
            category: article.category || 'General'
          }));

          // Mock other search results for demonstration
          const mockResults: SearchResult[] = [
            { id: '1', type: 'circle', title: 'Investment Circle', subtitle: '1.2k members', category: 'Investment' },
            { id: '2', type: 'category', title: 'Tax Planning', subtitle: '245 posts', category: 'Finance' },
            { id: '3', type: 'post', title: 'How to minimize tax liability', subtitle: 'by John Smith', category: 'Tax' },
            { id: '4', type: 'influencer', title: 'Jane Doe', subtitle: 'Financial Advisor', avatar: 'https://i.pravatar.cc/150?u=jane', category: 'Expert' },
            { id: '5', type: 'market', title: 'NIFTY 50', subtitle: '21,345.65 (+1.2%)', category: 'Index' },
          ];

          // Filter results based on search term
          const filteredMockResults = mockResults.filter(result => 
            result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            result.category?.toLowerCase().includes(searchTerm.toLowerCase())
          );

          setSearchResults([...newsSearchResults, ...filteredMockResults]);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClear = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  return {
    searchTerm,
    searchResults,
    activeTab,
    setActiveTab,
    handleSearchChange,
    handleClear
  };
};
