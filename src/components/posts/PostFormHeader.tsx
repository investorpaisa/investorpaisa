
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PostFormHeaderProps {
  userName: string | undefined;
  userAvatar: string | undefined;
  shareMode: 'public' | 'circle' | 'user';
  onShareModeChange: (value: 'public' | 'circle' | 'user') => void;
}

const PostFormHeader = ({ 
  userName, 
  userAvatar, 
  shareMode, 
  onShareModeChange 
}: PostFormHeaderProps) => {
  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={userAvatar || '/placeholder.svg'} />
        <AvatarFallback>{userName?.substring(0, 2).toUpperCase() || 'IP'}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">{userName || 'User'}</p>
        <div className="text-xs text-muted-foreground">
          <Tabs 
            value={shareMode} 
            onValueChange={(value) => onShareModeChange(value as 'public' | 'circle' | 'user')}
            className="mt-1"
          >
            <TabsList className="h-7 bg-muted/50">
              <TabsTrigger value="public" className="text-xs h-5 px-2">Public Post</TabsTrigger>
              <TabsTrigger value="circle" className="text-xs h-5 px-2">Circle Post</TabsTrigger>
              <TabsTrigger value="user" className="text-xs h-5 px-2">Direct Message</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PostFormHeader;
