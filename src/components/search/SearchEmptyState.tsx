
import React from 'react';

interface SearchEmptyStateProps {
  message: string;
}

const SearchEmptyState: React.FC<SearchEmptyStateProps> = ({ message }) => {
  return (
    <div className="text-center py-12 text-muted-foreground">
      <p>{message}</p>
    </div>
  );
};

export default SearchEmptyState;
