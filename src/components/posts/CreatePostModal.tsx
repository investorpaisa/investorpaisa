
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  Image, Video, X, Globe, Users, Lock, 
  Camera, FileText, Plus, Minus, Hash,
  Smile, AtSign, Calendar
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  postType: 'text' | 'image' | 'video' | 'article' | 'poll';
  userProfile: any;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ 
  isOpen, 
  onClose, 
  postType,
  userProfile 
}) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'connections' | 'private'>('public');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollDuration, setPollDuration] = useState('1_week');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePost = async () => {
    if (!content.trim() && !selectedImage && postType !== 'poll') {
      toast.error('Please add some content to your post');
      return;
    }

    if (postType === 'poll' && pollOptions.filter(opt => opt.trim()).length < 2) {
      toast.error('Please add at least 2 poll options');
      return;
    }
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Creating post:', { 
        content, 
        title,
        hashtags,
        visibility,
        postType,
        selectedImage,
        pollOptions: postType === 'poll' ? pollOptions.filter(opt => opt.trim()) : undefined,
        pollDuration: postType === 'poll' ? pollDuration : undefined
      });
      
      toast.success('Your post has been published!');
      resetForm();
      onClose();
    } catch (error) {
      console.error('Failed to create post:', error);
      toast.error('Failed to publish post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setContent('');
    setTitle('');
    setHashtags([]);
    setHashtagInput('');
    setSelectedImage(null);
    setPollOptions(['', '']);
    setPollDuration('1_week');
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('Image size should be less than 10MB');
        return;
      }
      setSelectedImage(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addHashtag = () => {
    if (hashtagInput.trim() && !hashtags.includes(hashtagInput.trim())) {
      setHashtags([...hashtags, hashtagInput.trim()]);
      setHashtagInput('');
    }
  };

  const removeHashtag = (tag: string) => {
    setHashtags(hashtags.filter(t => t !== tag));
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const getVisibilityIcon = () => {
    switch (visibility) {
      case 'public': return <Globe className="h-4 w-4" />;
      case 'connections': return <Users className="h-4 w-4" />;
      case 'private': return <Lock className="h-4 w-4" />;
    }
  };

  const getPostTypeTitle = () => {
    switch (postType) {
      case 'image': return 'Share a photo';
      case 'video': return 'Share a video';
      case 'article': return 'Write an article';
      case 'poll': return 'Create a poll';
      default: return 'Create a post';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>{getPostTypeTitle()}</span>
            {postType === 'image' && <Image className="h-5 w-5 text-blue-600" />}
            {postType === 'video' && <Video className="h-5 w-5 text-green-600" />}
            {postType === 'article' && <FileText className="h-5 w-5 text-orange-600" />}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={userProfile.avatar_url} alt={userProfile.full_name} />
              <AvatarFallback className="bg-blue-600 text-white">
                {userProfile.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{userProfile.full_name}</h3>
              <p className="text-sm text-gray-600">{userProfile.headline || 'Professional'}</p>
              <div className="flex items-center space-x-1 mt-1">
                {getVisibilityIcon()}
                <Select value={visibility} onValueChange={(value: any) => setVisibility(value)}>
                  <SelectTrigger className="w-auto border-none p-0 h-auto text-xs text-gray-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Anyone</SelectItem>
                    <SelectItem value="connections">Connections only</SelectItem>
                    <SelectItem value="private">Only you</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Article Title */}
          {postType === 'article' && (
            <div>
              <Label htmlFor="title">Article Title</Label>
              <Input
                id="title"
                placeholder="Give your article a compelling title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
              />
            </div>
          )}
          
          {/* Content */}
          <div>
            <Textarea
              placeholder={
                postType === 'article' 
                  ? "Write your article content here..."
                  : postType === 'poll'
                  ? "Ask a question for your poll..."
                  : "What do you want to talk about?"
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`resize-none border-none focus:ring-0 text-lg placeholder:text-gray-400 ${
                postType === 'article' ? 'min-h-48' : 'min-h-32'
              }`}
            />
          </div>

          {/* Poll Options */}
          {postType === 'poll' && (
            <div className="space-y-4">
              <Label>Poll Options</Label>
              {pollOptions.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => updatePollOption(index, e.target.value)}
                    className="flex-1"
                  />
                  {pollOptions.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePollOption(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              {pollOptions.length < 4 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addPollOption}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              )}

              <div>
                <Label htmlFor="poll-duration">Poll Duration</Label>
                <Select value={pollDuration} onValueChange={setPollDuration}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1_day">1 Day</SelectItem>
                    <SelectItem value="3_days">3 Days</SelectItem>
                    <SelectItem value="1_week">1 Week</SelectItem>
                    <SelectItem value="2_weeks">2 Weeks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Image Upload */}
          {(postType === 'image' || postType === 'text') && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              {selectedImage ? (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Upload preview"
                    className="w-full max-h-96 object-cover rounded-lg"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={removeImage}
                    className="absolute top-2 right-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-24 border-dashed"
                >
                  <div className="text-center">
                    <Camera className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                    <span className="text-sm text-gray-500">Click to add photo</span>
                  </div>
                </Button>
              )}
            </div>
          )}

          {/* Hashtags */}
          <div>
            <Label>Hashtags</Label>
            <div className="flex flex-wrap gap-2 mt-2 mb-2">
              {hashtags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                  <Hash className="h-3 w-3" />
                  <span>{tag}</span>
                  <button onClick={() => removeHashtag(tag)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                placeholder="Add hashtag..."
                value={hashtagInput}
                onChange={(e) => setHashtagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addHashtag()}
                className="flex-1"
              />
              <Button onClick={addHashtag} size="sm">Add</Button>
            </div>
          </div>
          
          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-600">
                <Smile className="h-5 w-5 mr-2" />
                Emoji
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600">
                <AtSign className="h-5 w-5 mr-2" />
                Mention
              </Button>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button
                onClick={handlePost}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Publishing...' : 'Post'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
