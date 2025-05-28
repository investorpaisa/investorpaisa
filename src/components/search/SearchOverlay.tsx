
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';
import SearchTabs from './SearchTabs';
import SearchTabContent from './SearchTabContent';
import { useSearchData } from '@/hooks/useSearchData';

interface SearchOverlayProps {
  isOpen: boolean;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen }) => {
  const { searchTerm, searchResults, activeTab, setActiveTab } = useSearchData();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <SearchTabs activeTab={activeTab} onTabChange={setActiveTab} />
              <SearchTabContent
                searchTerm={searchTerm}
                searchResults={searchResults}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SearchOverlay;
