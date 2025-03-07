
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface TrendingTopic {
  id: number;
  topic: string;
  posts: number;
}

interface TrendingTopicsProps {
  topics: TrendingTopic[];
}

const TrendingTopics = ({ topics }: TrendingTopicsProps) => {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Trending Topics</CardTitle>
        <CardDescription>What people are discussing now</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          {topics.map((topic) => (
            <div key={topic.id} className="flex items-center justify-between py-2 hover:bg-muted/30 px-2 rounded-md transition-colors cursor-pointer">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-ip-teal" />
                <span className="font-medium text-sm">{topic.topic}</span>
              </div>
              <span className="text-xs text-muted-foreground">{topic.posts} posts</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingTopics;
