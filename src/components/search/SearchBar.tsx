
import React from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  expanded: boolean;
  searchTerm: string;
  onToggleSearch: () => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

const SearchBar = ({
  expanded,
  searchTerm,
  onToggleSearch,
  onSearchChange,
  onClear,
  inputRef
}: SearchBarProps) => {
  return (
    <div 
      className={`flex items-center gap-2 transition-all duration-300 bg-white/80 border rounded-lg shadow-sm px-4 py-2.5 ${
        expanded ? 'w-full' : 'w-auto'
      }`}
    >
      <Button
        variant="ghost"
        size="icon"
        className={`h-9 w-9 flex-shrink-0 ${expanded ? 'text-gold' : 'text-black/60'}`}
        onClick={onToggleSearch}
      >
        <Search className="h-4 w-4" />
      </Button>
      
      {expanded && (
        <>
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search investors, topics, posts, news or markets..."
            className="flex-1 border-none shadow-none focus-visible:ring-0 pl-0 bg-transparent"
            value={searchTerm}
            onChange={onSearchChange}
          />
          
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0 text-black/60"
              onClick={onClear}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default SearchBar;
