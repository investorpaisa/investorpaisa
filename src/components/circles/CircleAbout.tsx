
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Flag } from 'lucide-react';
import { Circle } from '@/types';

interface CircleAboutProps {
  circle: Circle;
}

export function CircleAbout({ circle }: CircleAboutProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">About this Circle</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Description</p>
            <p className="text-muted-foreground">{circle.description || "No description available"}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Type</p>
            <p className="text-muted-foreground capitalize">{circle.type}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Created</p>
            <p className="text-muted-foreground">{new Date(circle.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Members</p>
            <p className="text-muted-foreground">{circle.member_count || 0}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Posts</p>
            <p className="text-muted-foreground">{circle.post_count || 0}</p>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="flex justify-end">
          <Button variant="outline" size="sm" className="text-destructive">
            <Flag className="h-4 w-4 mr-2" /> Report Circle
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
