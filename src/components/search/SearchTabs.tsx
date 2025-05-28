
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SearchTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const SearchTabs: React.FC<SearchTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <TabsList className="grid w-full grid-cols-6">
      <TabsTrigger value="for-you">For You</TabsTrigger>
      <TabsTrigger value="news">News</TabsTrigger>
      <TabsTrigger value="markets">Markets</TabsTrigger>
      <TabsTrigger value="people">People</TabsTrigger>
      <TabsTrigger value="categories">Categories</TabsTrigger>
      <TabsTrigger value="search">Search</TabsTrigger>
    </TabsList>
  );
};

export default SearchTabs;
