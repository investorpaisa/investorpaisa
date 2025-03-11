
import React from 'react';
import { RefreshCw } from 'lucide-react';

interface RefreshingIndicatorProps {
  isRefreshing: boolean;
}

const RefreshingIndicator = ({ isRefreshing }: RefreshingIndicatorProps) => {
  if (!isRefreshing) return null;
  
  return (
    <div className="flex justify-center py-2">
      <RefreshCw className="h-6 w-6 animate-spin text-ip-teal" />
    </div>
  );
};

export default RefreshingIndicator;
