
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Circle } from '@/types';
import { PlusCircle } from 'lucide-react';

interface CircleHeaderProps {
  circle: Circle;
  isMember: boolean;
  onJoin: () => void;
  onLeave: () => void;
  onCreatePost: () => void;
}

export function CircleHeader({ circle, isMember, onJoin, onLeave, onCreatePost }: CircleHeaderProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="flex flex-col">
            <CardTitle className="text-2xl">{circle.name}</CardTitle>
            <p className="text-muted-foreground mt-1">
              {circle.type === 'public' ? 'Public Circle' : 'Private Circle'} • {circle.member_count || 0} members • {circle.post_count || 0} posts
            </p>
          </div>
          
          <div className="flex space-x-2">
            {!isMember ? (
              <Button onClick={onJoin}>Join Circle</Button>
            ) : (
              <>
                <Button variant="outline" onClick={onLeave}>Leave Circle</Button>
                <Button onClick={onCreatePost}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Create Post
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-muted-foreground">{circle.description || 'No description available'}</p>
      </CardContent>
    </Card>
  );
}
