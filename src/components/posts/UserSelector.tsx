
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

interface UserSelectorProps {
  users: User[];
  searchTerm: string;
  selectedUser: string | null;
  onSearchChange: (value: string) => void;
  onUserSelect: (userId: string, userName: string) => void;
  onUserClear: () => void;
}

const UserSelector = ({
  users,
  searchTerm,
  selectedUser,
  onSearchChange,
  onUserSelect,
  onUserClear
}: UserSelectorProps) => {
  const filteredUsers = searchTerm
    ? users.filter(
        user => 
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          user.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-2">
      <Label htmlFor="user">Send to User</Label>
      <Popover>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              id="user"
              placeholder="Search by name or username..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full"
            />
            {selectedUser && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2" 
                  onClick={onUserClear}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          {searchTerm && filteredUsers.length > 0 ? (
            <div className="max-h-[200px] overflow-y-auto">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-2 p-2 hover:bg-muted cursor-pointer"
                  onClick={() => onUserSelect(user.id, user.name)}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">@{user.username}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {searchTerm ? "No users found" : "Start typing to search users"}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default UserSelector;
