
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, MessageCircle } from 'lucide-react';

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

interface ProfileInteractionsTabProps {
  interactions: Interaction[];
}

const ProfileInteractionsTab = ({ interactions }: ProfileInteractionsTabProps) => {
  return (
    <div className="space-y-6">
      {interactions.length > 0 ? (
        interactions.map((interaction) => (
          <Card key={interaction.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                {interaction.type === 'like' ? (
                  <Heart className="h-4 w-4 mr-2 text-ip-teal" />
                ) : (
                  <MessageCircle className="h-4 w-4 mr-2 text-ip-teal" />
                )}
                <span>
                  You {interaction.type === 'like' ? 'liked' : 'commented on'} a post by {interaction.post.author}
                </span>
              </div>
              <CardTitle className="text-lg">{interaction.post.title}</CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              {interaction.type === 'comment' && interaction.content && (
                <div className="bg-muted p-3 rounded-md mb-3">
                  <p className="text-sm italic">"{interaction.content}"</p>
                </div>
              )}
              <div className="text-sm text-muted-foreground text-right">
                {interaction.post.date}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No interactions yet.</p>
        </div>
      )}
    </div>
  );
};

export default ProfileInteractionsTab;
