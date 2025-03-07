
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, MessageCircle } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  date: string;
  isShared: boolean;
}

interface ProfilePostsTabProps {
  posts: Post[];
}

const ProfilePostsTab = ({ posts }: ProfilePostsTabProps) => {
  return (
    <div className="space-y-6">
      {posts.length > 0 ? (
        posts.map((post) => (
          <Card key={post.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{post.title}</CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-muted-foreground mb-3 line-clamp-2">{post.content}</p>
              <div className="flex justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Heart className="mr-1 h-4 w-4" />
                    {post.likes} likes
                  </span>
                  <span className="flex items-center">
                    <MessageCircle className="mr-1 h-4 w-4" />
                    {post.comments} comments
                  </span>
                </div>
                <div>{post.date}</div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No posts yet.</p>
        </div>
      )}
    </div>
  );
};

export default ProfilePostsTab;
