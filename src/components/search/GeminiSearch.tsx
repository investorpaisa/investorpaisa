
import React, { useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSearchData } from '@/hooks/useSearchData';
import SearchBar from './SearchBar';
import SearchOverlay from './SearchOverlay';

interface GeminiSearchProps {
  expanded: boolean;
  onExpandToggle: (expanded: boolean) => void;
  trendingTopics: any[]; // Using any type to match the original component
}

export const GeminiSearch = ({ expanded, onExpandToggle, trendingTopics = [] }: GeminiSearchProps) => {
  const {
    searchTerm,
    searchResults,
    activeTab,
    setActiveTab,
    handleSearchChange,
    handleClear
  } = useSearchData();
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        onExpandToggle(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onExpandToggle]);

  useEffect(() => {
    if (expanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [expanded]);

  const handleToggleSearch = () => {
    onExpandToggle(!expanded);
  };

  return (
    <div 
      ref={searchRef} 
      className={`relative transition-all duration-300 ${expanded ? 'w-full' : ''}`}
    >
      <SearchBar 
        expanded={expanded}
        searchTerm={searchTerm}
        onToggleSearch={handleToggleSearch}
        onSearchChange={handleSearchChange}
        onClear={handleClear}
        inputRef={inputRef}
      />
      
      <SearchOverlay 
        isOpen={expanded}
      />
    </div>
  );
};
