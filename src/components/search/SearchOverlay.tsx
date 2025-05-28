
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SearchResults from './SearchResults';
import SearchTrendingUsers from './SearchTrendingUsers';
import SearchTrendingCategories from './SearchTrendingCategories';
import SearchTrendingNews from './SearchTrendingNews';
import SearchMarketTrends from './SearchMarketTrends';
import SearchNews from './SearchNews';
import { useSearchData } from '@/hooks/useSearchData';

interface SearchOverlayProps {
  isOpen: boolean;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen }) => {
  const { searchTerm, searchResults, activeTab, setActiveTab } = useSearchData();

  if (!isOpen) return null;

  // Mock data for components that expect props
  const mockMarkets = [];
  const mockUsers = [];
  const mockCategories = [];

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="for-you">For You</TabsTrigger>
                <TabsTrigger value="news">News</TabsTrigger>
                <TabsTrigger value="markets">Markets</TabsTrigger>
                <TabsTrigger value="people">People</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="search">Search</TabsTrigger>
              </TabsList>

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
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Enter a search term to see results</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SearchOverlay;
