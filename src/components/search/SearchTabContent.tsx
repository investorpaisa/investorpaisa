
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import SearchResults from './SearchResults';
import SearchTrendingUsers from './SearchTrendingUsers';
import SearchTrendingCategories from './SearchTrendingCategories';
import SearchTrendingNews from './SearchTrendingNews';
import SearchMarketTrends from './SearchMarketTrends';
import SearchNews from './SearchNews';
import SearchEmptyState from './SearchEmptyState';
import { SearchResult } from './SearchResults';

interface SearchTabContentProps {
  searchTerm: string;
  searchResults: SearchResult[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SearchTabContent: React.FC<SearchTabContentProps> = ({
  searchTerm,
  searchResults,
  activeTab,
  setActiveTab
}) => {
  // Mock data for components that expect props
  const mockMarkets = [];
  const mockUsers = [];
  const mockCategories = [];

  return (
    <>
      <TabsContent value="for-you" className="mt-6">
        {searchTerm ? (
          <SearchResults 
            results={searchResults} 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SearchTrendingNews />
            <SearchMarketTrends markets={mockMarkets} />
          </div>
        )}
      </TabsContent>

      <TabsContent value="news" className="mt-6">
        <SearchNews />
      </TabsContent>

      <TabsContent value="markets" className="mt-6">
        <SearchMarketTrends markets={mockMarkets} />
      </TabsContent>

      <TabsContent value="people" className="mt-6">
        <SearchTrendingUsers users={mockUsers} />
      </TabsContent>

      <TabsContent value="categories" className="mt-6">
        <SearchTrendingCategories categories={mockCategories} />
      </TabsContent>

      <TabsContent value="search" className="mt-6">
        {searchTerm ? (
          <SearchResults 
            results={searchResults}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        ) : (
          <SearchEmptyState message="Enter a search term to see results" />
        )}
      </TabsContent>
    </>
  );
};

export default SearchTabContent;
