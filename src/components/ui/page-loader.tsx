
import React from 'react';
import { Loader2 } from 'lucide-react';

export const PageLoader: React.FC = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-premium">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-premium-gold/10 animate-pulse"></div>
          <Loader2 className="h-8 w-8 animate-spin text-premium-gold" />
        </div>
        <div className="space-y-2 text-center">
          <p className="text-sm text-premium-gold font-medium">Loading</p>
          <p className="text-xs text-muted-foreground">Please wait while we prepare your experience</p>
        </div>
      </div>
    </div>
  );
};
