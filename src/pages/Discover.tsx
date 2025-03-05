
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Clock, Users } from 'lucide-react';

const Discover = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Discover</h1>
        <p className="text-muted-foreground">Explore trending topics and discussions in the investing community.</p>
      </div>

      <Tabs defaultValue="trending" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="latest">Latest</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="space-y-4">
          {trendingTopics.map((topic, index) => (
            <DiscoverCard key={index} topic={topic} />
          ))}
        </TabsContent>

        <TabsContent value="latest" className="space-y-4">
          <p className="text-muted-foreground py-8 text-center">Latest topics will appear here.</p>
        </TabsContent>

        <TabsContent value="popular" className="space-y-4">
          <p className="text-muted-foreground py-8 text-center">Popular topics will appear here.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface DiscoverCardProps {
  topic: {
    title: string;
    category: string;
    participants: number;
    posts: number;
    lastActive: string;
  };
}

const DiscoverCard: React.FC<DiscoverCardProps> = ({ topic }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="text-sm text-ip-teal font-medium mb-1">{topic.category}</div>
        <CardTitle>{topic.title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-muted-foreground text-sm">
          Join the discussion with other investors and financial experts.
        </p>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground flex justify-between pt-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" /> {topic.participants}
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> {topic.posts} posts
          </span>
        </div>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> {topic.lastActive}
        </span>
      </CardFooter>
    </Card>
  );
};

// Sample data
const trendingTopics = [
  {
    title: "Tax-saving investments for the financial year 2023-24",
    category: "Taxation",
    participants: 345,
    posts: 89,
    lastActive: "2 hours ago"
  },
  {
    title: "Is investing in index funds better than active mutual funds?",
    category: "Investments",
    participants: 567,
    posts: 124,
    lastActive: "35 minutes ago"
  },
  {
    title: "Best credit cards for travel benefits in 2024",
    category: "Personal Finance",
    participants: 289,
    posts: 67,
    lastActive: "1 hour ago"
  },
  {
    title: "How to effectively manage home loan EMIs",
    category: "Debt Management",
    participants: 178,
    posts: 45,
    lastActive: "3 hours ago"
  }
];

export default Discover;
