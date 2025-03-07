
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfilePostsTab from './ProfilePostsTab';
import ProfileInteractionsTab from './ProfileInteractionsTab';

interface Post {
  id: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  date: string;
  isShared: boolean;
}

interface Interaction {
  id: string;
  type: 'like' | 'comment';
  content?: string;
  post: {
    id: string;
    title: string;
    author: string;
    date: string;
  };
}

interface ProfileActivityTabsProps {
  posts: Post[];
  interactions: Interaction[];
}

const ProfileActivityTabs = ({ posts, interactions }: ProfileActivityTabsProps) => {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="w-full justify-start border-b rounded-none h-auto p-0">
        <TabsTrigger 
          value="posts" 
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-ip-teal data-[state=active]:shadow-none py-3"
        >
          Posts
        </TabsTrigger>
        <TabsTrigger 
          value="interactions" 
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-ip-teal data-[state=active]:shadow-none py-3"
        >
          Interactions
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="posts" className="pt-6">
        <ProfilePostsTab posts={posts} />
      </TabsContent>
      
      <TabsContent value="interactions" className="pt-6">
        <ProfileInteractionsTab interactions={interactions} />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileActivityTabs;
