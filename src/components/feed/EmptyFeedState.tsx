
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

const EmptyFeedState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">No posts yet</h3>
      <p className="text-muted-foreground text-center mb-4">Follow more users and experts to see their posts here</p>
      <Button>Discover People to Follow</Button>
    </div>
  );
};

export default EmptyFeedState;
