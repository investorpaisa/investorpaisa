
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Author {
  name: string;
  username: string;
  avatar: string;
  role: string;
  verified: boolean;
}

interface PostCardHeaderProps {
  author: Author;
  category: string;
  timestamp: string;
}

const PostCardHeader = ({ author, category, timestamp }: PostCardHeaderProps) => {
  return (
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-3">
        <Avatar 
          className="cursor-pointer transition-transform hover:scale-105"
        >
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback>{author.name.charAt(0)}{author.name.split(' ')[1]?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-1">
            <h4 
              className="font-medium hover:underline cursor-pointer"
            >
              {author.name}
            </h4>
            {author.verified && (
              <span className="text-ip-teal">
                <TrendingUp className="h-3 w-3" />
              </span>
            )}
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <span className="mr-2">@{author.username}</span>
            <span className="mr-2">•</span>
            <span>{timestamp}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <Badge variant="outline" className="bg-ip-blue-50 text-ip-blue-800 mr-2 hover:bg-ip-blue-100 transition-colors">
          {category}
        </Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Report content</DropdownMenuItem>
            <DropdownMenuItem>Hide posts from this user</DropdownMenuItem>
            <DropdownMenuItem>Copy link</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default PostCardHeader;
