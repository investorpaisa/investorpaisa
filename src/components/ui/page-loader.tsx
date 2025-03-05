
import React from 'react';
import { Loader2 } from 'lucide-react';

export const PageLoader: React.FC = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-ip-teal" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
};
