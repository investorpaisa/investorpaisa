
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Image, Video, Calendar, FileText, 
  Globe, Users, Lock, Briefcase 
} from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: {
    name: string;
    avatar: string;
    title: string;
    company: string;
  };
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ 
  isOpen, 
  onClose, 
  userProfile 
}) => {
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'connections' | 'private'>('public');
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!content.trim()) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Creating post:', { content, visibility });
      onClose();
      setContent('');
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVisibilityIcon = () => {
    switch (visibility) {
      case 'public':
        return <Globe className="h-4 w-4" />;
      case 'connections':
        return <Users className="h-4 w-4" />;
      case 'private':
        return <Lock className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const getVisibilityText = () => {
    switch (visibility) {
      case 'public':
        return 'Anyone';
      case 'connections':
        return 'Connections only';
      case 'private':
        return 'Only you';
      default:
        return 'Anyone';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create a post</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
              <AvatarFallback>{userProfile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">{userProfile.name}</h3>
              <p className="text-sm text-gray-600">{userProfile.title} at {userProfile.company}</p>
              <div className="flex items-center space-x-1 mt-1">
                {getVisibilityIcon()}
                <span className="text-xs text-gray-500">{getVisibilityText()}</span>
              </div>
            </div>
          </div>
          
          <Textarea
            placeholder="What do you want to talk about?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-32 resize-none border-none focus:ring-0 text-lg placeholder:text-gray-400"
          />
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-600">
                <Image className="h-5 w-5 mr-2" />
                Photo
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600">
                <Video className="h-5 w-5 mr-2" />
                Video
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600">
                <Calendar className="h-5 w-5 mr-2" />
                Event
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600">
                <FileText className="h-5 w-5 mr-2" />
                Article
              </Button>
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as any)}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="public">Anyone</option>
                <option value="connections">Connections only</option>
                <option value="private">Only you</option>
              </select>
              
              <Button
                onClick={handlePost}
                disabled={!content.trim() || loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
