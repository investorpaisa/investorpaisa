
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Image, Video, FileText, BarChart3, 
  Globe, Users, Lock, X, Hash
} from 'lucide-react';
import { ProfessionalUser } from '@/types/professional';
import { toast } from 'sonner';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  postType: 'text' | 'image' | 'video' | 'article' | 'poll';
  userProfile: ProfessionalUser;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  postType,
  userProfile
}) => {
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [visibility, setVisibility] = useState<'public' | 'connections' | 'private'>('public');
  const [hashtags, setHashtags] = useState('');

  const handlePost = async () => {
    if (!content.trim()) {
      toast.error('Please write something to share');
      return;
    }

    setIsPosting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Here you would normally save to backend
    console.log('Creating post:', {
      content,
      postType,
      visibility,
      hashtags: hashtags.split(' ').filter(tag => tag.startsWith('#')),
      author: userProfile.id
    });
    
    toast.success('Post created successfully!');
    setContent('');
    setHashtags('');
    setIsPosting(false);
    onClose();
  };

  const getPostTypeIcon = () => {
    switch (postType) {
      case 'image': return <Image className="h-5 w-5" />;
      case 'video': return <Video className="h-5 w-5" />;
      case 'article': return <FileText className="h-5 w-5" />;
      case 'poll': return <BarChart3 className="h-5 w-5" />;
      default: return null;
    }
  };

  const getPostTypeLabel = () => {
    switch (postType) {
      case 'image': return 'Share a photo';
      case 'video': return 'Share a video';
      case 'article': return 'Write an article';
      case 'poll': return 'Create a poll';
      default: return 'Create a post';
    }
  };

  const getVisibilityIcon = () => {
    switch (visibility) {
      case 'public': return <Globe className="h-4 w-4" />;
      case 'connections': return <Users className="h-4 w-4" />;
      case 'private': return <Lock className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center space-x-2">
              {getPostTypeIcon()}
              <span>{getPostTypeLabel()}</span>
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={userProfile.avatar_url || ''} alt={userProfile.full_name} />
              <AvatarFallback className="bg-blue-600 text-white">
                {userProfile.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-gray-900">{userProfile.full_name}</h4>
                {userProfile.is_verified && (
                  <Badge className="bg-blue-100 text-blue-800 text-xs">Verified</Badge>
                )}
              </div>
              <p className="text-sm text-gray-600">{userProfile.headline}</p>
              
              {/* Visibility Selector */}
              <div className="flex items-center space-x-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => {
                    const options: Array<'public' | 'connections' | 'private'> = ['public', 'connections', 'private'];
                    const currentIndex = options.indexOf(visibility);
                    const nextIndex = (currentIndex + 1) % options.length;
                    setVisibility(options[nextIndex]);
                  }}
                >
                  {getVisibilityIcon()}
                  <span className="ml-1 capitalize">{visibility}</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Content Input */}
          <div className="space-y-3">
            <Textarea
              placeholder={`What's on your mind, ${userProfile.full_name?.split(' ')[0]}?`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] border-none resize-none focus:ring-0 text-lg placeholder:text-gray-400"
              maxLength={3000}
            />
            
            {/* Character Count */}
            <div className="flex justify-end">
              <span className="text-xs text-gray-500">
                {content.length}/3000
              </span>
            </div>
          </div>

          {/* Hashtags Input */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Hash className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Add hashtags</span>
            </div>
            <Input
              placeholder="#finance #investing #market"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              className="border-gray-200"
            />
          </div>

          {/* Post Type Specific Fields */}
          {postType === 'poll' && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <h5 className="font-medium text-gray-900">Poll Options</h5>
              <Input placeholder="Option 1" className="bg-white" />
              <Input placeholder="Option 2" className="bg-white" />
              <Button variant="outline" size="sm" className="w-full">
                Add Option
              </Button>
            </div>
          )}

          {postType === 'image' && (
            <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <Image className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Click to upload an image or drag and drop
                </p>
              </div>
            </div>
          )}

          {postType === 'video' && (
            <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <Video className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Click to upload a video or drag and drop
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Post to {userProfile.followers} followers</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isPosting}>
              Cancel
            </Button>
            <Button 
              onClick={handlePost} 
              disabled={!content.trim() || isPosting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isPosting ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
