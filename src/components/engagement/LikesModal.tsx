
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Check } from 'lucide-react';
import { ProfessionalUser } from '@/types/professional';

interface LikesModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  totalLikes: number;
}

export const LikesModal: React.FC<LikesModalProps> = ({
  isOpen,
  onClose,
  postId,
  totalLikes
}) => {
  const [users, setUsers] = useState<ProfessionalUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [followingUsers, setFollowingUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) {
      loadUsersWhoLiked();
    }
  }, [isOpen, postId]);

  const loadUsersWhoLiked = async () => {
    setLoading(true);
    
    // Simulate API call - replace with actual backend call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockUsers: ProfessionalUser[] = [
      {
        id: '1',
        username: 'sarah_finance',
        full_name: 'Sarah Johnson',
        headline: 'Investment Analyst at Goldman Sachs',
        avatar_url: '/placeholder.svg',
        location: 'Mumbai, India',
        industry: 'Investment Banking',
        followers: 2156,
        following: 890,
        connections: 1543,
        is_verified: true,
        premium_member: true,
        experience_years: 5
      },
      {
        id: '2',
        username: 'amit_trader',
        full_name: 'Amit Patel',
        headline: 'Senior Equity Trader',
        avatar_url: '/placeholder.svg',
        location: 'Delhi, India',
        industry: 'Capital Markets',
        followers: 1834,
        following: 456,
        connections: 987,
        is_verified: false,
        premium_member: false,
        experience_years: 7
      },
      {
        id: '3',
        username: 'financial_guru',
        full_name: 'Ravi Kumar',
        headline: 'Chartered Accountant & Tax Consultant',
        avatar_url: '/placeholder.svg',
        location: 'Bangalore, India',
        industry: 'Financial Services',
        followers: 3421,
        following: 234,
        connections: 2109,
        is_verified: true,
        premium_member: true,
        experience_years: 12
      }
    ];
    
    setUsers(mockUsers);
    setLoading(false);
  };

  const handleFollow = (userId: string) => {
    setFollowingUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[70vh]">
        <DialogHeader>
          <DialogTitle>
            Likes ({totalLikes})
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-1 overflow-y-auto max-h-[50vh]">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center space-x-3 p-3 animate-pulse">
                  <div className="h-12 w-12 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32" />
                    <div className="h-3 bg-gray-200 rounded w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar_url || ''} alt={user.full_name} />
                    <AvatarFallback>
                      {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{user.full_name}</h4>
                      {user.is_verified && (
                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                          Verified
                        </Badge>
                      )}
                      {user.premium_member && (
                        <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                          Premium
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{user.headline}</p>
                    <p className="text-xs text-gray-500">{user.location}</p>
                  </div>
                </div>
                
                <Button
                  variant={followingUsers.has(user.id) ? "outline" : "default"}
                  size="sm"
                  onClick={() => handleFollow(user.id)}
                  className={followingUsers.has(user.id) ? "text-gray-600" : "bg-blue-600 hover:bg-blue-700"}
                >
                  {followingUsers.has(user.id) ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-1" />
                      Follow
                    </>
                  )}
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
