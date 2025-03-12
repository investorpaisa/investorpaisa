
import { useState, useEffect } from 'react';
import { SearchResult } from '@/components/search/SearchResults';

export const useSearchData = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [activeTab, setActiveTab] = useState('for-you');

  useEffect(() => {
    if (searchTerm.trim()) {
      // Mock search results - in a real app, would fetch from API
      const results: SearchResult[] = [
        { id: '1', type: 'circle', title: 'Investment Circle', subtitle: '1.2k members', category: 'Investment' },
        { id: '2', type: 'category', title: 'Tax Planning', subtitle: '245 posts', category: 'Finance' },
        { id: '3', type: 'post', title: 'How to minimize tax liability', subtitle: 'by John Smith', category: 'Tax' },
        { id: '4', type: 'influencer', title: 'Jane Doe', subtitle: 'Financial Advisor', avatar: 'https://i.pravatar.cc/150?u=jane', category: 'Expert' },
        { id: '5', type: 'circle', title: 'Retirement Planning', subtitle: '3.4k members', category: 'Planning' },
        { id: '6', type: 'influencer', title: 'Mike Wilson', subtitle: 'Tax Expert', avatar: 'https://i.pravatar.cc/150?u=mike', category: 'Expert' },
        { id: '7', type: 'news', title: 'Budget 2023: Key Highlights', subtitle: 'Economic Times', category: 'Economy' },
        { id: '8', type: 'market', title: 'NIFTY 50', subtitle: '21,345.65 (+1.2%)', category: 'Index' },
      ];
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
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
