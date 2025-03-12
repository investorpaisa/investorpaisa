
import React from 'react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface TrendingUser {
  id: string;
  name: string;
  role: string;
  avatar: string;
  followers: string;
}

interface SearchTrendingUsersProps {
  users: TrendingUser[];
}

const SearchTrendingUsers = ({ users }: SearchTrendingUsersProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium text-black flex items-center gap-2">
          <User className="h-4 w-4 text-gold" />
          Trending Influencers
        </h3>
        <Button variant="ghost" size="sm" className="text-gold text-xs">See All</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {users.map((user) => (
          <div key={user.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-black/5 cursor-pointer">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-black/70">{user.role}</p>
            </div>
            <div className="text-xs text-gold font-medium">{user.followers}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchTrendingUsers;
