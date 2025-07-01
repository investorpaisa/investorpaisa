
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Image, Video, Calendar, FileText, 
  Smile, Poll, Celebration, Camera
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { CreatePostModal } from './CreatePostModal';

export const CreatePostWidget: React.FC = () => {
  const { profile } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [postType, setPostType] = useState<'text' | 'image' | 'video' | 'article' | 'poll'>('text');

  const handleCreatePost = (type: typeof postType) => {
    setPostType(type);
    setIsCreateModalOpen(true);
  };

  if (!profile) return null;

  return (
    <>
      <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 mb-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name || ''} />
              <AvatarFallback className="bg-blue-600 text-white">
                {profile.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => handleCreatePost('text')}
              className="flex-1 text-left p-4 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-50 transition-colors font-medium"
            >
              Start a post, share an update...
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              onClick={() => handleCreatePost('image')}
            >
              <Image className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Photo</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 text-gray-600 hover:bg-green-50 hover:text-green-600 transition-colors"
              onClick={() => handleCreatePost('video')}
            >
              <Video className="h-5 w-5 text-green-600" />
              <span className="font-medium">Video</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              onClick={() => handleCreatePost('article')}
            >
              <FileText className="h-5 w-5 text-orange-600" />
              <span className="font-medium">Article</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition-colors"
              onClick={() => handleCreatePost('poll')}
            >
              <Poll className="h-5 w-5 text-purple-600" />
              <span className="font-medium">Poll</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        postType={postType}
        userProfile={profile}
      />
    </>
  );
};
