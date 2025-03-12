
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import SearchTrendingCategories from './SearchTrendingCategories';
import SearchTrendingUsers from './SearchTrendingUsers';
import SearchTrendingNews from './SearchTrendingNews';
import SearchMarketTrends from './SearchMarketTrends';
import SearchResults, { SearchResult } from './SearchResults';

interface SearchOverlayProps {
  isMobile: boolean;
  searchResults: SearchResult[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SearchOverlay = ({ 
  isMobile, 
  searchResults, 
  activeTab,
  setActiveTab
}: SearchOverlayProps) => {
  // Mock data functions
  const getTrendingCategories = () => {
    return [
      { id: '1', name: 'Budget 2023', posts: 345 },
      { id: '2', name: 'Tax Planning', posts: 287 },
      { id: '3', name: 'Stock Market', posts: 234 },
      { id: '4', name: 'Cryptocurrency', posts: 189 },
      { id: '5', name: 'Mutual Funds', posts: 156 },
      { id: '6', name: 'Retirement Planning', posts: 132 },
    ];
  };

  const getTrendingUsers = () => {
    return [
      { id: '1', name: 'Rahul Sharma', role: 'Financial Advisor', avatar: 'https://i.pravatar.cc/150?u=rahul', followers: '34.5k' },
      { id: '2', name: 'Priya Patel', role: 'Tax Consultant', avatar: 'https://i.pravatar.cc/150?u=priya', followers: '28.7k' },
      { id: '3', name: 'Vikram Malhotra', role: 'Investment Banker', avatar: 'https://i.pravatar.cc/150?u=vikram', followers: '19.3k' },
      { id: '4', name: 'Anjali Desai', role: 'Stock Market Analyst', avatar: 'https://i.pravatar.cc/150?u=anjali', followers: '15.8k' },
    ];
  };

  const getTrendingNews = () => {
    return [
      { id: '1', title: 'Budget 2023: Key Highlights for Individual Taxpayers', source: 'Economic Times', time: '2 hours ago' },
      { id: '2', title: 'RBI Keeps Repo Rate Unchanged at 6.5% for Sixth Consecutive Time', source: 'Mint', time: '5 hours ago' },
      { id: '3', title: 'New Tax Regime: How to Calculate Your Tax Liability', source: 'Financial Express', time: '1 day ago' },
      { id: '4', title: 'Top 5 Mutual Funds to Invest in 2023', source: 'Business Standard', time: '2 days ago' },
    ];
  };

  const getTrendingMarkets = () => {
    return [
      { id: '1', name: 'NIFTY 50', value: '21,345.65', change: '+1.2%', status: 'up' as const },
      { id: '2', name: 'Sensex', value: '70,123.45', change: '+0.8%', status: 'up' as const },
      { id: '3', name: 'S&P 500', value: '5,064.23', change: '-0.3%', status: 'down' as const },
      { id: '4', name: 'Bitcoin', value: '$66,789.12', change: '+2.4%', status: 'up' as const },
      { id: '5', name: 'Ethereum', value: '$3,456.78', change: '+1.5%', status: 'up' as const },
    ];
  };

  return (
    <div 
      className={`fixed inset-0 top-16 z-50 bg-white p-4 ${
        isMobile ? 'min-h-[calc(100vh-64px)]' : 'min-h-[min(90vh,800px)]'
      }`}
      style={{
        boxShadow: '0 -4px 50px rgba(0, 0, 0, 0.1)'
      }}
    >
      <ScrollArea className={isMobile ? 'h-[calc(100vh-80px)]' : 'max-h-[700px]'}>
        <div className="max-w-4xl mx-auto">
          {searchResults.length > 0 ? (
            <SearchResults 
              results={searchResults} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />
          ) : (
            <div className="space-y-8">
              <SearchTrendingCategories categories={getTrendingCategories()} />
              <SearchTrendingUsers users={getTrendingUsers()} />
              <SearchTrendingNews newsItems={getTrendingNews()} />
              <SearchMarketTrends markets={getTrendingMarkets()} />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SearchOverlay;
