
import React from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CircleMember } from '@/types';

interface CircleMembersProps {
  members: CircleMember[];
}

export function CircleMembers({ members }: CircleMembersProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Members ({members.length})</h3>
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.map(member => (
          <Card key={member.id} className="flex items-center p-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={member.profile?.avatar_url || ""} alt={member.profile?.full_name || ""} />
              <AvatarFallback>{member.profile?.full_name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="ml-4 flex-1">
              <p className="font-medium">{member.profile?.full_name || "Unknown User"}</p>
              <p className="text-xs text-muted-foreground">
                @{member.profile?.username || "username"} • {member.role}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
